import express from "express";
import { prisma } from "../../db/client.js";
import { authenticateAdmin } from "../../middleware/authAdmin.js";
import {
  ensureDefaultCommissionRule,
  percentToRateBps,
  rateBpsToPercent,
  resolveCommission,
  DEFAULT_COMMISSION_BPS,
} from "../../services/commission.js";

const router = express.Router();

/** GET /admin/commission — global + per-hotel overrides */
router.get("/", authenticateAdmin, async (_req, res) => {
  try {
    await ensureDefaultCommissionRule();

    const globalRule = await prisma.commissionRule.findFirst({
      where: { hotelId: null, active: true },
      orderBy: { createdAt: "desc" },
    });

    const hotels = await prisma.hotel.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        status: true,
        owner: { select: { email: true } },
      },
      orderBy: { name: "asc" },
    });

    const overrides = await prisma.commissionRule.findMany({
      where: { hotelId: { not: null }, active: true },
      orderBy: { createdAt: "desc" },
    });

    const overrideByHotel = new Map();
    for (const rule of overrides) {
      if (rule.hotelId && !overrideByHotel.has(rule.hotelId)) {
        overrideByHotel.set(rule.hotelId, rule);
      }
    }

    const hotelRows = [];
    for (const hotel of hotels) {
      const resolved = await resolveCommission(hotel.id);
      const override = overrideByHotel.get(hotel.id);
      hotelRows.push({
        hotelId: hotel.id,
        name: hotel.name,
        city: hotel.address,
        status: hotel.status,
        ownerEmail: hotel.owner?.email || null,
        ratePercent: rateBpsToPercent(resolved.rateBps),
        rateBps: resolved.rateBps,
        source: resolved.source,
        hasOverride: Boolean(override),
      });
    }

    res.json({
      defaultPercent: rateBpsToPercent(DEFAULT_COMMISSION_BPS),
      global: {
        ratePercent: rateBpsToPercent(globalRule?.rateBps ?? DEFAULT_COMMISSION_BPS),
        rateBps: globalRule?.rateBps ?? DEFAULT_COMMISSION_BPS,
        fixedFee: globalRule?.fixedFee ?? 0,
        ruleId: globalRule?.id || null,
      },
      hotels: hotelRows,
    });
  } catch (err) {
    console.error("Admin commission list error:", err);
    res.status(500).json({ error: "Failed to load commission settings" });
  }
});

/** PUT /admin/commission/global  body: { ratePercent: 15 } */
router.put("/global", authenticateAdmin, async (req, res) => {
  try {
    const ratePercent = Number(req.body?.ratePercent);
    if (Number.isNaN(ratePercent) || ratePercent < 0 || ratePercent > 100) {
      return res.status(400).json({ error: "ratePercent must be between 0 and 100" });
    }
    const rateBps = percentToRateBps(ratePercent);

    // Deactivate previous global rules, create new active one
    await prisma.commissionRule.updateMany({
      where: { hotelId: null, active: true },
      data: { active: false },
    });

    const rule = await prisma.commissionRule.create({
      data: {
        hotelId: null,
        rateBps,
        fixedFee: Number(req.body?.fixedFee || 0),
        active: true,
      },
    });

    res.json({
      message: "Global commission updated",
      global: {
        ratePercent: rateBpsToPercent(rule.rateBps),
        rateBps: rule.rateBps,
        fixedFee: rule.fixedFee,
        ruleId: rule.id,
      },
    });
  } catch (err) {
    console.error("Admin global commission error:", err);
    res.status(500).json({ error: "Failed to update global commission" });
  }
});

/** PUT /admin/commission/hotels/:hotelId  body: { ratePercent: 15 } */
router.put("/hotels/:hotelId", authenticateAdmin, async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const ratePercent = Number(req.body?.ratePercent);
    if (Number.isNaN(ratePercent) || ratePercent < 0 || ratePercent > 100) {
      return res.status(400).json({ error: "ratePercent must be between 0 and 100" });
    }
    const rateBps = percentToRateBps(ratePercent);

    await prisma.commissionRule.updateMany({
      where: { hotelId, active: true },
      data: { active: false },
    });

    const rule = await prisma.commissionRule.create({
      data: {
        hotelId,
        rateBps,
        fixedFee: Number(req.body?.fixedFee || 0),
        active: true,
      },
    });

    res.json({
      message: "Hotel commission updated",
      hotelId,
      ratePercent: rateBpsToPercent(rule.rateBps),
      rateBps: rule.rateBps,
      source: "hotel",
    });
  } catch (err) {
    console.error("Admin hotel commission error:", err);
    res.status(500).json({ error: "Failed to update hotel commission" });
  }
});

/** DELETE /admin/commission/hotels/:hotelId — remove override (fall back to global) */
router.delete("/hotels/:hotelId", authenticateAdmin, async (req, res) => {
  try {
    const { hotelId } = req.params;
    await prisma.commissionRule.updateMany({
      where: { hotelId, active: true },
      data: { active: false },
    });
    const resolved = await resolveCommission(hotelId);
    res.json({
      message: "Hotel override removed; using global/default",
      hotelId,
      ratePercent: rateBpsToPercent(resolved.rateBps),
      source: resolved.source,
    });
  } catch (err) {
    console.error("Admin clear hotel commission error:", err);
    res.status(500).json({ error: "Failed to clear hotel commission" });
  }
});

export default router;
