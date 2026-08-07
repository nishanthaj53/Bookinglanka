import express from "express";
import { prisma } from "../../db/client.js";
import { requireStripe, stripeConfigured } from "../../services/stripe.js";
import { finalizePaidBooking } from "../payments.js";

const router = express.Router();

/**
 * Stripe webhook — must receive raw body (mounted before express.json).
 * POST /webhooks/stripe
 */
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!stripeConfigured) {
      return res.status(503).send("Stripe not configured");
    }

    const stripe = requireStripe();
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    let event;
    try {
      if (webhookSecret && !webhookSecret.includes("change_me") && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // Local/dev fallback when webhook secret not set yet
        event = JSON.parse(req.body.toString("utf8"));
      }
    } catch (err) {
      console.error("Stripe webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const bookingId = session.metadata?.bookingId;
          if (bookingId && session.payment_status === "paid") {
            await finalizePaidBooking({
              bookingId,
              sessionId: session.id,
              paymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : session.payment_intent?.id,
            });
          }
          break;
        }
        case "payment_intent.succeeded": {
          const pi = event.data.object;
          const bookingId = pi.metadata?.bookingId;
          if (bookingId) {
            await finalizePaidBooking({
              bookingId,
              paymentIntentId: pi.id,
            });
          }
          break;
        }
        case "account.updated": {
          const account = event.data.object;
          if (account?.id) {
            const status =
              account.charges_enabled && account.payouts_enabled
                ? "VERIFIED"
                : "PENDING";
            await prisma.payoutAccount.updateMany({
              where: { accountId: account.id, provider: "stripe" },
              data: { status, updatedAt: new Date() },
            });
          }
          break;
        }
        default:
          break;
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Stripe webhook handler error:", err);
      res.status(500).json({ error: "Webhook handler failed" });
    }
  }
);

export default router;
