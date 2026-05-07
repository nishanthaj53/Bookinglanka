import express from "express";
import { prisma } from "../../db/client.js";
import { authenticateManager } from "../../middleware/authManager.js";

const router = express.Router();

function maskAccountNumber(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  if (value.length <= 4) return value;
  return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

// View manager payout account settings
router.get("/", authenticateManager, async (req, res) => {
  try {
    const account = await prisma.payoutAccount.findUnique({
      where: { userId: req.user.id },
    });

    if (!account) {
      return res.json({
        exists: false,
        provider: "bank",
        accountId: "",
        maskedAccountId: "",
        status: "PENDING",
        bankName: "",
        accountHolder: "",
      });
    }

    const details = account.detailsJson && typeof account.detailsJson === "object" ? account.detailsJson : {};
    res.json({
      exists: true,
      provider: account.provider || "bank",
      accountId: account.accountId || "",
      maskedAccountId: maskAccountNumber(account.accountId),
      status: account.status,
      bankName: String(details.bankName || ""),
      accountHolder: String(details.accountHolder || ""),
      updatedAt: account.updatedAt,
    });
  } catch (err) {
    console.error("Payout account fetch error:", err);
    res.status(500).json({ error: "Failed to load payout account details" });
  }
});

// Create or update manager payout account
router.put("/", authenticateManager, async (req, res) => {
  try {
    const provider = String(req.body?.provider || "bank").trim() || "bank";
    const accountId = String(req.body?.accountId || "").trim();
    const bankName = String(req.body?.bankName || "").trim();
    const accountHolder = String(req.body?.accountHolder || "").trim();

    if (!accountId || accountId.length < 6) {
      return res.status(400).json({ error: "Please enter a valid account number (minimum 6 characters)." });
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
      account: {
        provider: saved.provider,
        accountId: saved.accountId || "",
        maskedAccountId: maskAccountNumber(saved.accountId),
        status: saved.status,
        bankName,
        accountHolder,
        updatedAt: saved.updatedAt,
      },
    });
  } catch (err) {
    console.error("Payout account save error:", err);
    res.status(500).json({ error: "Failed to save payout account details" });
  }
});

export default router;
