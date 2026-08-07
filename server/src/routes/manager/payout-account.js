import express from "express";
import { prisma } from "../../db/client.js";
import { authenticateManager } from "../../middleware/authManager.js";
import { requireStripe, stripeConfigured } from "../../services/stripe.js";

const router = express.Router();

const FRONTEND_URL = (
  process.env.FRONTEND_URL ||
  process.env.CORS_ORIGIN ||
  "http://localhost:5173"
)
  .split(",")[0]
  .trim();

const API_PUBLIC_URL = (
  process.env.API_PUBLIC_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 8080}`
).replace(/\/$/, "");

function maskAccountNumber(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  if (value.length <= 4) return value;
  return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

function serializeAccount(account) {
  if (!account) {
    return {
      exists: false,
      provider: "bank",
      accountId: "",
      maskedAccountId: "",
      status: "PENDING",
      bankName: "",
      accountHolder: "",
      stripeReady: false,
    };
  }
  const details =
    account.detailsJson && typeof account.detailsJson === "object"
      ? account.detailsJson
      : {};
  return {
    exists: true,
    provider: account.provider || "bank",
    accountId: account.accountId || "",
    maskedAccountId: maskAccountNumber(account.accountId),
    status: account.status,
    bankName: String(details.bankName || ""),
    accountHolder: String(details.accountHolder || ""),
    updatedAt: account.updatedAt,
    stripeReady:
      account.provider === "stripe" &&
      account.status === "VERIFIED" &&
      String(account.accountId || "").startsWith("acct_"),
  };
}

// View manager payout account settings
router.get("/", authenticateManager, async (req, res) => {
  try {
    const account = await prisma.payoutAccount.findUnique({
      where: { userId: req.user.id },
    });
    res.json(serializeAccount(account));
  } catch (err) {
    console.error("Payout account fetch error:", err);
    res.status(500).json({ error: "Failed to load payout account details" });
  }
});

// Create or update manager payout account (manual bank)
router.put("/", authenticateManager, async (req, res) => {
  try {
    const provider = String(req.body?.provider || "bank").trim() || "bank";
    const accountId = String(req.body?.accountId || "").trim();
    const bankName = String(req.body?.bankName || "").trim();
    const accountHolder = String(req.body?.accountHolder || "").trim();

    if (provider === "stripe") {
      return res.status(400).json({
        error: "Use Stripe Connect onboarding button to link a Stripe account.",
      });
    }

    if (!accountId || accountId.length < 6) {
      return res
        .status(400)
        .json({ error: "Please enter a valid account number (minimum 6 characters)." });
    }

    const saved = await prisma.payoutAccount.upsert({
      where: { userId: req.user.id },
      update: {
        provider,
        accountId,
        status: "PENDING",
        detailsJson: { bankName, accountHolder },
        updatedAt: new Date(),
      },
      create: {
        userId: req.user.id,
        provider,
        accountId,
        status: "PENDING",
        detailsJson: { bankName, accountHolder },
      },
    });

    res.json({
      message: "Payout account details saved",
      account: serializeAccount(saved),
    });
  } catch (err) {
    console.error("Payout account save error:", err);
    res.status(500).json({ error: "Failed to save payout account details" });
  }
});

/**
 * POST /manager/payout-account/stripe/onboard
 * Creates Express Connect account (if needed) and returns Account Link URL.
 */
router.post("/stripe/onboard", authenticateManager, async (req, res) => {
  try {
    if (!stripeConfigured) {
      return res.status(503).json({
        error: "Stripe is not configured. Set STRIPE_SECRET_KEY on the server.",
      });
    }
    const stripe = requireStripe();
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    let account = await prisma.payoutAccount.findUnique({
      where: { userId: req.user.id },
    });

    let stripeAccountId = account?.accountId;
    if (!stripeAccountId || !String(stripeAccountId).startsWith("acct_")) {
      const created = await stripe.accounts.create({
        type: "express",
        email: user?.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          product_description: "Hotel bookings via Booking Lanka",
        },
        metadata: { userId: req.user.id },
      });
      stripeAccountId = created.id;

      account = await prisma.payoutAccount.upsert({
        where: { userId: req.user.id },
        update: {
          provider: "stripe",
          accountId: stripeAccountId,
          status: "PENDING",
          updatedAt: new Date(),
        },
        create: {
          userId: req.user.id,
          provider: "stripe",
          accountId: stripeAccountId,
          status: "PENDING",
        },
      });
    } else if (account.provider !== "stripe") {
      account = await prisma.payoutAccount.update({
        where: { userId: req.user.id },
        data: { provider: "stripe", updatedAt: new Date() },
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${FRONTEND_URL}/manager/dashboard/payout-account?stripe=refresh`,
      return_url: `${FRONTEND_URL}/manager/dashboard/payout-account?stripe=return`,
      type: "account_onboarding",
    });

    res.json({
      url: accountLink.url,
      accountId: stripeAccountId,
      apiHint: `Also set Stripe webhook to ${API_PUBLIC_URL}/webhooks/stripe`,
    });
  } catch (err) {
    console.error("Stripe onboard error:", err);
    res.status(500).json({ error: err.message || "Failed to start Stripe onboarding" });
  }
});

/**
 * POST /manager/payout-account/stripe/refresh
 * Sync charges_enabled / payouts_enabled into PayoutAccount.status
 */
router.post("/stripe/refresh", authenticateManager, async (req, res) => {
  try {
    if (!stripeConfigured) {
      return res.status(503).json({ error: "Stripe is not configured" });
    }
    const stripe = requireStripe();
    const account = await prisma.payoutAccount.findUnique({
      where: { userId: req.user.id },
    });

    if (!account?.accountId || !String(account.accountId).startsWith("acct_")) {
      return res.status(400).json({ error: "No Stripe Connect account linked yet" });
    }

    const stripeAccount = await stripe.accounts.retrieve(account.accountId);
    const status =
      stripeAccount.charges_enabled && stripeAccount.payouts_enabled
        ? "VERIFIED"
        : "PENDING";

    const updated = await prisma.payoutAccount.update({
      where: { userId: req.user.id },
      data: {
        provider: "stripe",
        status,
        updatedAt: new Date(),
        detailsJson: {
          ...(account.detailsJson && typeof account.detailsJson === "object"
            ? account.detailsJson
            : {}),
          chargesEnabled: stripeAccount.charges_enabled,
          payoutsEnabled: stripeAccount.payouts_enabled,
          detailsSubmitted: stripeAccount.details_submitted,
        },
      },
    });

    res.json({
      message: status === "VERIFIED" ? "Stripe account ready for payouts" : "Onboarding incomplete",
      account: serializeAccount(updated),
      stripe: {
        chargesEnabled: stripeAccount.charges_enabled,
        payoutsEnabled: stripeAccount.payouts_enabled,
        detailsSubmitted: stripeAccount.details_submitted,
      },
    });
  } catch (err) {
    console.error("Stripe refresh error:", err);
    res.status(500).json({ error: err.message || "Failed to refresh Stripe status" });
  }
});

export default router;
