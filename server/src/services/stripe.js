import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY || "";

export const stripeConfigured =
  Boolean(secret) &&
  !secret.includes("change_me") &&
  secret.startsWith("sk_");

export const stripe = stripeConfigured ? new Stripe(secret) : null;

/** Convert major currency units (e.g. $120.50) to Stripe minor units (cents). */
export function toStripeAmount(majorUnits) {
  return Math.max(0, Math.round(Number(majorUnits || 0) * 100));
}

export function fromStripeAmount(minorUnits) {
  return Number(minorUnits || 0) / 100;
}

export function requireStripe() {
  if (!stripe) {
    const err = new Error(
      "Stripe is not configured. Set a valid STRIPE_SECRET_KEY on the server."
    );
    err.status = 503;
    throw err;
  }
  return stripe;
}
