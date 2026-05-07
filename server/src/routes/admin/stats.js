import express from "express";
import { prisma } from "../../db/client.js";
import { authenticateAdmin } from "../../middleware/authAdmin.js";

const router = express.Router();

const INCOME_STATUSES = ["PAID", "CHECKED_IN", "COMPLETED"];

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

// ✅ Get admin statistics (platform) or per-hotel (?hotelId=)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const hotelId = typeof req.query.hotelId === "string" && req.query.hotelId.trim() ? req.query.hotelId.trim() : null;

    if (hotelId) {
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        select: { id: true, name: true, status: true },
      });
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }

      const bookingWhere = { hotelId };

      const [totalBookings, revenueResult, statusBreakdown, monthlyRevenueRaw, monthlyBookingsRaw] =
        await Promise.all([
          prisma.booking.count({ where: bookingWhere }),
          prisma.booking.aggregate({
            _sum: { totalAmount: true },
            where: {
              ...bookingWhere,
              status: { in: INCOME_STATUSES },
            },
          }),
          prisma.booking.groupBy({
            by: ["status"],
            where: bookingWhere,
            _count: { id: true },
          }),
          prisma.$queryRaw`
            SELECT 
              to_char("createdAt", 'YYYY-MM') AS month, 
              SUM("totalAmount") AS amount
            FROM "Booking"
            WHERE "hotelId" = ${hotelId}
              AND status IN ('PAID', 'CHECKED_IN', 'COMPLETED')
            GROUP BY month
            ORDER BY month;
          `,
          prisma.$queryRaw`
            SELECT 
              to_char("createdAt", 'YYYY-MM') AS month, 
              COUNT(*)::int AS bookings
            FROM "Booking"
            WHERE "hotelId" = ${hotelId}
            GROUP BY month
            ORDER BY month;
          `,
        ]);

      const statusCounts = Object.fromEntries(
        statusBreakdown.map((s) => [s.status, s._count.id])
      );

      const monthlyRevenue = (monthlyRevenueRaw || []).map((r) => ({
        month: r.month,
        amount: Number(r.amount) || 0,
      }));
      const monthlyBookings = (monthlyBookingsRaw || []).map((r) => ({
        month: r.month,
        bookings: Number(r.bookings) || 0,
      }));

      const monthlySeries = buildMonthlySeries(monthlyRevenue, monthlyBookings);

      return res.json({
        scope: "hotel",
        hotel,
        totalBookings,
        totalRevenue: revenueResult._sum.totalAmount || 0,
        statusCounts,
        monthlyRevenue,
        monthlySeries,
      });
    }

    const [
      totalUsers,
      totalManagers,
      totalHotels,
      activeHotels,
      totalBookings,
      revenueResult,
      monthlyRevenueRaw,
      monthlyBookingsRaw,
      statusBreakdown,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { roles: { has: "MANAGER" } } }),
      prisma.hotel.count(),
      prisma.hotel.count({ where: { status: "ACTIVE" } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: INCOME_STATUSES } },
      }),
      prisma.$queryRaw`
        SELECT 
          to_char("createdAt", 'YYYY-MM') AS month, 
          SUM("totalAmount") AS amount
        FROM "Booking"
        WHERE status IN ('PAID', 'CHECKED_IN', 'COMPLETED')
        GROUP BY month
        ORDER BY month;
      `,
      prisma.$queryRaw`
        SELECT 
          to_char("createdAt", 'YYYY-MM') AS month, 
          COUNT(*)::int AS bookings
        FROM "Booking"
        GROUP BY month
        ORDER BY month;
      `,
      prisma.booking.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    const totalRevenue = revenueResult._sum.totalAmount || 0;
    const monthlyRevenue = (monthlyRevenueRaw || []).map((r) => ({
      month: r.month,
      amount: Number(r.amount) || 0,
    }));
    const monthlyBookings = (monthlyBookingsRaw || []).map((r) => ({
      month: r.month,
      bookings: Number(r.bookings) || 0,
    }));
    const monthlySeries = buildMonthlySeries(monthlyRevenue, monthlyBookings);
    const statusCounts = Object.fromEntries(statusBreakdown.map((s) => [s.status, s._count.id]));

    res.json({
      scope: "platform",
      totalUsers,
      totalManagers,
      totalHotels,
      activeHotels,
      totalBookings,
      totalRevenue,
      monthlyRevenue,
      monthlySeries,
      statusCounts,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
