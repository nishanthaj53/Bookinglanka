import { prisma } from "../db/client.js";

/** Default platform commission: 15% = 1500 basis points */
export const DEFAULT_COMMISSION_BPS = 1500;

/**
 * Resolve active commission for a hotel.
 * Priority: per-hotel active rule → global active rule → 15% default.
 */
export async function resolveCommission(hotelId) {
  if (hotelId) {
    const hotelRule = await prisma.commissionRule.findFirst({
      where: { hotelId, active: true },
      orderBy: { createdAt: "desc" },
    });
    if (hotelRule) {
      return {
        rateBps: hotelRule.rateBps,
        fixedFee: hotelRule.fixedFee || 0,
        source: "hotel",
        ruleId: hotelRule.id,
      };
    }
  }

  const globalRule = await prisma.commissionRule.findFirst({
    where: { hotelId: null, active: true },
    orderBy: { createdAt: "desc" },
  });

  if (globalRule) {
    return {
      rateBps: globalRule.rateBps,
      fixedFee: globalRule.fixedFee || 0,
      source: "global",
      ruleId: globalRule.id,
    };
  }

  return {
    rateBps: DEFAULT_COMMISSION_BPS,
    fixedFee: 0,
    source: "default",
    ruleId: null,
  };
}

/** application fee in major currency units (same as Booking.totalAmount) */
export function calcApplicationFeeMajor(totalAmount, rateBps, fixedFee = 0) {
  const pct = (Number(totalAmount || 0) * Number(rateBps || 0)) / 10000;
  return Math.max(0, Math.round((pct + Number(fixedFee || 0)) * 100) / 100);
}

export function rateBpsToPercent(rateBps) {
  return Number(rateBps || 0) / 100;
}

export function percentToRateBps(percent) {
  return Math.round(Number(percent || 0) * 100);
}

/** Ensure a global default 15% rule exists */
export async function ensureDefaultCommissionRule() {
  const existing = await prisma.commissionRule.findFirst({
    where: { hotelId: null, active: true },
  });
  if (existing) return existing;
  return prisma.commissionRule.create({
    data: {
      hotelId: null,
      rateBps: DEFAULT_COMMISSION_BPS,
      fixedFee: 0,
      active: true,
    },
  });
}
