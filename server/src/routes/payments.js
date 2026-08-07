import express from "express";
import { prisma } from "../db/client.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  calcApplicationFeeMajor,
  resolveCommission,
} from "../services/commission.js";
import {
  requireStripe,
  toStripeAmount,
  stripeConfigured,
} from "../services/stripe.js";
import { sendBookingConfirmationEmail } from "../services/emailService.js";

const router = express.Router();

const FRONTEND_URL = (
  process.env.FRONTEND_URL ||
  process.env.CORS_ORIGIN ||
  "http://localhost:5173"
)
  .split(",")[0]
  .trim();

async function loadPayableBookings(userId, bookingIds) {
  const ids = [...new Set((bookingIds || []).map(String).filter(Boolean))];
  if (!ids.length) return [];

  return prisma.booking.findMany({
    where: {
      id: { in: ids },
      userId,
      status: { in: ["PENDING_PAYMENT", "DRAFT"] },
    },
    include: {
      hotel: {
        include: {
          owner: {
            include: { payoutAcc: true },
          },
        },
      },
      roomType: true,
      user: true,
      payment: true,
    },
  });
}

function getConnectAccountId(booking) {
  const pa = booking.hotel?.owner?.payoutAcc;
  if (!pa) return null;
  if (pa.provider !== "stripe") return null;
  if (!pa.accountId || !String(pa.accountId).startsWith("acct_")) return null;
  if (pa.status !== "VERIFIED") return null;
  return pa.accountId;
}

/**
 * POST /payments/checkout
 * Body: { bookingIds: string[] }
 * Creates Stripe Checkout Session(s). Returns first session URL;
 * remaining bookings are paid after redirect when cart continues.
 */
router.post("/checkout", authenticateUser, async (req, res) => {
  try {
    if (!stripeConfigured) {
      return res.status(503).json({
        error:
          "Stripe is not configured yet. Add a real STRIPE_SECRET_KEY on the server.",
      });
    }
    const stripe = requireStripe();

    const bookingIds = Array.isArray(req.body?.bookingIds)
      ? req.body.bookingIds
      : [];
    const bookings = await loadPayableBookings(req.user.id, bookingIds);

    if (!bookings.length) {
      return res.status(400).json({
        error: "No payable bookings found. Manager must accept request bookings first.",
      });
    }

    // Process one booking per Checkout Session (different hotels → different Connect accounts)
    const booking = bookings[0];
    const destination = getConnectAccountId(booking);

    if (!destination) {
      return res.status(400).json({
        error:
          "This hotel manager has not completed Stripe Connect onboarding. Payment cannot be split yet.",
        code: "MANAGER_STRIPE_REQUIRED",
        hotelName: booking.hotel?.name,
      });
    }

    const commission = await resolveCommission(booking.hotelId);
    const feeMajor = calcApplicationFeeMajor(
      booking.totalAmount,
      commission.rateBps,
      commission.fixedFee
    );
    const amountMinor = toStripeAmount(booking.totalAmount);
    const feeMinor = toStripeAmount(feeMajor);

    if (feeMinor >= amountMinor) {
      return res.status(400).json({
        error: "Commission is too high for this booking amount.",
      });
    }

    const currency = String(booking.currency || "USD").toLowerCase();

    const payment = await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        provider: "stripe",
        amount: amountMinor,
        applicationFee: feeMinor,
        destinationAccountId: destination,
        status: "INITIATED",
        fee: 0,
        net: Math.max(0, amountMinor - feeMinor),
      },
      create: {
        bookingId: booking.id,
        provider: "stripe",
        amount: amountMinor,
        applicationFee: feeMinor,
        destinationAccountId: destination,
        status: "INITIATED",
        fee: 0,
        net: Math.max(0, amountMinor - feeMinor),
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.user?.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amountMinor,
            product_data: {
              name: `${booking.hotel?.name || "Hotel"} — ${booking.roomType?.name || "Room"}`,
              description: `${new Date(booking.checkIn).toLocaleDateString()} → ${new Date(booking.checkOut).toLocaleDateString()} · Admin fee ${commission.rateBps / 100}%`,
            },
          },
        },
      ],
      payment_intent_data: {
        application_fee_amount: feeMinor,
        transfer_data: {
          destination,
        },
        metadata: {
          bookingId: booking.id,
          paymentId: payment.id,
          hotelId: booking.hotelId,
          commissionBps: String(commission.rateBps),
        },
      },
      metadata: {
        bookingId: booking.id,
        paymentId: payment.id,
        userId: req.user.id,
      },
      success_url: `${FRONTEND_URL}/dashboard/bookings/cart?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/dashboard/bookings/cart?checkout=cancel`,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { gatewayRef: session.id },
    });

    const remainingIds = bookings.slice(1).map((b) => b.id);

    res.json({
      url: session.url,
      sessionId: session.id,
      bookingId: booking.id,
      remainingBookingIds: remainingIds,
      split: {
        total: booking.totalAmount,
        adminFee: feeMajor,
        adminPercent: commission.rateBps / 100,
        managerReceives: Math.max(0, Number(booking.totalAmount) - feeMajor),
        destination,
      },
    });
  } catch (err) {
    console.error("Checkout create error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Failed to start Stripe checkout",
    });
  }
});

/**
 * GET /payments/session/:sessionId
 * Confirm session status after redirect (webhook is source of truth; this helps UI).
 */
router.get("/session/:sessionId", authenticateUser, async (req, res) => {
  try {
    const stripe = requireStripe();
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return res.status(404).json({ error: "Session not linked to a booking" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking || booking.userId !== req.user.id) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // If webhook lagged, finalize from session here
    if (
      session.payment_status === "paid" &&
      booking.status !== "PAID" &&
      ["PENDING_PAYMENT", "DRAFT"].includes(booking.status)
    ) {
      await finalizePaidBooking({
        bookingId,
        sessionId: session.id,
        paymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
      });
    }

    const fresh = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true, hotel: true },
    });

    res.json({
      paymentStatus: session.payment_status,
      booking: fresh,
    });
  } catch (err) {
    console.error("Session status error:", err);
    res.status(500).json({ error: err.message || "Failed to read session" });
  }
});

export async function finalizePaidBooking({
  bookingId,
  sessionId,
  paymentIntentId,
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true, hotel: true, payment: true },
  });
  if (!booking) return null;
  if (booking.status === "PAID") return booking;

  const paid = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "PAID" },
    include: { user: true, hotel: true },
  });

  if (booking.payment) {
    await prisma.payment.update({
      where: { id: booking.payment.id },
      data: {
        status: "CAPTURED",
        capturedAt: new Date(),
        gatewayRef: paymentIntentId || sessionId || booking.payment.gatewayRef,
      },
    });
  }

  if (paid.user?.email) {
    try {
      await sendBookingConfirmationEmail(paid.user.email, paid);
    } catch (e) {
      console.error("Confirmation email failed:", e.message);
    }
  }

  return paid;
}

export default router;
