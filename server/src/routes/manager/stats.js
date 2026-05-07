import express from "express";
import { prisma } from "../../db/client.js";
import { authenticateManager } from "../../middleware/authManager.js";

const router = express.Router();

const INCOME_STATUSES = new Set(["PAID", "CHECKED_IN", "COMPLETED"]);

function toMonthKey(d) {
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return null;
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
}

function parseDateStart(s) {
  if (!s || typeof s !== "string") return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseDateEnd(s) {
  if (!s || typeof s !== "string") return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(23, 59, 59, 999);
  return d;
}

function buildMonthlySeries(monthlyRevenueRows, monthlyBookingRows) {
  const rev = new Map((monthlyRevenueRows || []).map((r) => [r.month, Number(r.amount) || 0]));
  const book = new Map((monthlyBookingRows || []).map((r) => [r.month, Number(r.bookings) || 0]));
  const months = [...new Set([...rev.keys(), ...book.keys()])].sort();
  let cumulative = 0;
  return months.map((month) => {
    const revenue = rev.get(month) || 0;
    cumulative += revenue;
    return {
      month,
      revenue,
      bookings: book.get(month) || 0,
      cumulativeRevenue: cumulative,
    };
  });
}

/**
 * GET /manager/stats?hotelId=&from=YYYY-MM-DD&to=YYYY-MM-DD
 * Bookings for hotels owned by the manager; optional single-hotel and createdAt range.
 */
router.get("/", authenticateManager, async (req, res) => {
  try {
    const managerId = req.user.id;
    const hotelIdParam = typeof req.query.hotelId === "string" && req.query.hotelId.trim() ? req.query.hotelId.trim() : null;
    const from = parseDateStart(req.query.from);
    const to = parseDateEnd(req.query.to);

    const myHotels = await prisma.hotel.findMany({
      where: { ownerUserId: managerId },
      select: { id: true, name: true, status: true },
      orderBy: { name: "asc" },
    });

    const ids = myHotels.map((h) => h.id);

    if (ids.length === 0) {
      return res.json({
        scope: "manager",
        hotels: [],
        hotel: null,
        totalBookings: 0,
        totalRevenue: 0,
        statusCounts: {},
        monthlyRevenue: [],
        monthlySeries: [],
      });
    }

    if (hotelIdParam && !ids.includes(hotelIdParam)) {
      return res.status(403).json({ error: "You do not manage this hotel" });
    }

    const hotelScopeIds = hotelIdParam ? [hotelIdParam] : ids;

    const createdFilter = {};
    if (from) createdFilter.gte = from;
    if (to) createdFilter.lte = to;
    const createdAt =
      Object.keys(createdFilter).length > 0 ? { createdAt: createdFilter } : {};

    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: { in: hotelScopeIds },
        ...createdAt,
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        hotelId: true,
      },
    });

    const totalBookings = bookings.length;
    const statusCounts = {};
    let totalRevenue = 0;

    const revenueByMonth = new Map();
    const bookingsByMonth = new Map();

    for (const b of bookings) {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
      if (INCOME_STATUSES.has(b.status)) {
        totalRevenue += Number(b.totalAmount) || 0;
      }
      const mk = toMonthKey(b.createdAt);
      if (!mk) continue;
      if (INCOME_STATUSES.has(b.status)) {
        revenueByMonth.set(mk, (revenueByMonth.get(mk) || 0) + (Number(b.totalAmount) || 0));
      }
      bookingsByMonth.set(mk, (bookingsByMonth.get(mk) || 0) + 1);
    }

    const monthlyRevenue = [...revenueByMonth.entries()]
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const monthlyBookingRows = [...bookingsByMonth.entries()]
      .map(([month, count]) => ({ month, bookings: count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const monthlySeries = buildMonthlySeries(monthlyRevenue, monthlyBookingRows);

    const selectedHotel = hotelIdParam ? myHotels.find((h) => h.id === hotelIdParam) || null : null;

    return res.json({
      scope: hotelIdParam ? "manager_hotel" : "manager_all",
      hotels: myHotels,
      hotel: selectedHotel,
      totalBookings,
      totalRevenue,
      statusCounts,
      monthlyRevenue,
      monthlySeries,
    });
  } catch (err) {
    console.error("Manager stats error:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
