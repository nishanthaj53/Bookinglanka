import express from "express"
import { prisma } from "../../db/client.js"
import { authenticateManager } from "../../middleware/authManager.js"
import {
  sendBookingAcceptedEmail,
  sendBookingDecisionDeclinedEmail,
  sendBookingStatusUpdateEmail,
} from "../../services/emailService.js"

const router = express.Router()
const BOOKING_REQUEST_EXPIRY_MINUTES = Number(process.env.BOOKING_REQUEST_EXPIRY_MINUTES || 120)

function bookingRequestExpiresAt(createdAt) {
  return new Date(createdAt.getTime() + BOOKING_REQUEST_EXPIRY_MINUTES * 60 * 1000)
}

// ✅ View all bookings for manager’s hotels
router.get("/", authenticateManager, async (req, res) => {
  try {
    const now = new Date()
    const managerDrafts = await prisma.booking.findMany({
      where: {
        hotel: { ownerUserId: req.user.id },
        status: 'DRAFT',
      },
      select: { id: true, createdAt: true },
    })
    const expiredIds = managerDrafts
      .filter((b) => bookingRequestExpiresAt(b.createdAt) <= now)
      .map((b) => b.id)
    if (expiredIds.length) {
      await prisma.booking.updateMany({
        where: { id: { in: expiredIds }, status: 'DRAFT' },
        data: { status: 'CANCELLED' },
      })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        hotel: { ownerUserId: req.user.id },
      },
      include: {
        hotel: { select: { name: true, address: true } },
        roomType: { select: { name: true, pricePerNight: true } },
        user: { select: { email: true, displayName: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    res.json(
      bookings.map((b) => ({
        ...b,
        requestExpiresAt: b.status === 'DRAFT' ? bookingRequestExpiresAt(b.createdAt).toISOString() : null,
      }))
    )
  } catch (err) {
    console.error("Manager bookings fetch error:", err)
    res.status(500).json({ error: "Failed to load bookings" })
  }
})

// ✅ Manager accepts/rejects a DRAFT booking
// PATCH /manager/bookings/:bookingId/decision { decision: "ACCEPT" | "DECLINE" }
router.patch("/:bookingId/decision", authenticateManager, async (req, res) => {
  try {
    const { bookingId } = req.params
    const decision = String(req.body?.decision || "").toUpperCase()

    if (!["ACCEPT", "DECLINE"].includes(decision)) {
      return res.status(400).json({ error: "Invalid decision" })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { hotel: true, user: { select: { email: true } } },
    })
    if (!booking || booking.hotel.ownerUserId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    if (decision === "ACCEPT" && booking.status !== "DRAFT") {
      return res.status(400).json({ error: "Only DRAFT bookings can be accepted" })
    }
    if (decision === "DECLINE" && !["DRAFT", "PENDING_PAYMENT"].includes(booking.status)) {
      return res.status(400).json({ error: "Only booking requests can be declined" })
    }

    const nextStatus = decision === "ACCEPT" ? "PENDING_PAYMENT" : "CANCELLED"

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: nextStatus },
    })

    if (booking.user?.email) {
      try {
        if (decision === "ACCEPT") {
          await sendBookingAcceptedEmail(booking.user.email, booking)
        } else {
          await sendBookingDecisionDeclinedEmail(booking.user.email, booking)
        }
      } catch (e) {
        console.error("Booking decision email failed:", e?.message || e)
      }
    }

    res.json({
      message: decision === "ACCEPT" ? "Booking accepted" : "Booking declined",
      booking: updated,
    })
  } catch (err) {
    console.error("Booking decision update error:", err)
    res.status(500).json({ error: "Failed to update booking decision" })
  }
})

// POST /manager/bookings/:bookingId/remind-payment
// Creates in-system reminder (no email)
router.post("/:bookingId/remind-payment", authenticateManager, async (req, res) => {
  try {
    const { bookingId } = req.params
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: { select: { id: true, ownerUserId: true, name: true } },
        user: { select: { email: true, displayName: true } },
      },
    })
    if (!booking || booking.hotel.ownerUserId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }
    if (!["DRAFT", "PENDING_PAYMENT"].includes(booking.status)) {
      return res.status(400).json({ error: "Reminder is only allowed for unpaid booking requests" })
    }
    if (!booking.user?.email) {
      return res.status(400).json({ error: "Guest account is not available" })
    }

    const now = new Date()
    const reminderMessage = `Manager reminder: complete payment for ${booking.hotel.name} booking.`
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        reminderAt: now,
        reminderSeenAt: null,
        reminderMessage,
      },
    })

    res.json({ message: "Reminder sent in system notifications" })
  } catch (err) {
    console.error("Booking reminder error:", err)
    res.status(500).json({ error: `Failed to send reminder: ${err?.message || "unknown error"}` })
  }
})

// ✅ Manager updates booking status to CHECKED_IN or COMPLETED
router.patch("/:bookingId/status", authenticateManager, async (req, res) => {
  try {
    const { bookingId } = req.params
    const { status } = req.body

    const allowed = ["CHECKED_IN", "COMPLETED"]
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status change" })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { hotel: true, user: { select: { email: true } } },
    })
    if (!booking || booking.hotel.ownerUserId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const updatableFrom = ["PENDING_PAYMENT", "PAID", "CHECKED_IN"]
    if (!updatableFrom.includes(booking.status)) {
      return res.status(400).json({ error: `Cannot change status from ${booking.status}` })
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    if (booking.user?.email) {
      try {
        await sendBookingStatusUpdateEmail(booking.user.email, booking, status)
      } catch (e) {
        console.error("Booking status email failed:", e?.message || e)
      }
    }

    res.json({ message: "Booking status updated", booking: updated })
  } catch (err) {
    console.error("Booking status update error:", err)
    res.status(500).json({ error: "Failed to update status" })
  }
})

// ✅ Calendar summary for accepted/active bookings
// GET /manager/bookings/calendar/summary?month=2026-04&hotelId=<optional>
router.get("/calendar/summary", authenticateManager, async (req, res) => {
  try {
    const month = String(req.query.month || "")
    const hotelId = req.query.hotelId ? String(req.query.hotelId) : null

    const monthMatch = /^(\d{4})-(\d{2})$/.exec(month)
    if (!monthMatch) {
      return res.status(400).json({ error: "month must be YYYY-MM" })
    }

    const year = Number(monthMatch[1])
    const monthIndex = Number(monthMatch[2]) - 1
    if (monthIndex < 0 || monthIndex > 11) {
      return res.status(400).json({ error: "Invalid month value" })
    }

    const monthStart = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0))
    const monthEnd = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0))

    const where = {
      hotel: { ownerUserId: req.user.id, ...(hotelId ? { id: hotelId } : {}) },
      status: { in: ["PAID", "CHECKED_IN", "COMPLETED"] },
      checkIn: { lt: monthEnd },
      checkOut: { gt: monthStart },
    }

    const bookings = await prisma.booking.findMany({
      where,
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
      },
    })

    const dayCounts = {}
    const monthDays = new Date(year, monthIndex + 1, 0).getDate()

    for (const b of bookings) {
      const start = b.checkIn > monthStart ? b.checkIn : monthStart
      const endExclusive = b.checkOut < monthEnd ? b.checkOut : monthEnd

      const cursor = new Date(start)
      cursor.setUTCHours(0, 0, 0, 0)
      const end = new Date(endExclusive)
      end.setUTCHours(0, 0, 0, 0)

      while (cursor < end) {
        const y = cursor.getUTCFullYear()
        const m = String(cursor.getUTCMonth() + 1).padStart(2, "0")
        const d = String(cursor.getUTCDate()).padStart(2, "0")
        const key = `${y}-${m}-${d}`
        dayCounts[key] = (dayCounts[key] || 0) + 1
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
    }

    const days = []
    for (let d = 1; d <= monthDays; d++) {
      const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      days.push({ date: key, count: dayCounts[key] || 0 })
    }

    res.json({
      month,
      hotelId,
      totalAcceptedBookings: bookings.length,
      days,
    })
  } catch (err) {
    console.error("Calendar summary fetch error:", err)
    res.status(500).json({ error: "Failed to load calendar summary" })
  }
})

export default router
