// server/src/routes/bookings.js
import express from 'express'
import { prisma } from '../db/client.js'
import { authenticateUser } from '../middleware/authMiddleware.js'
import { sendBookingConfirmationEmail } from '../services/emailService.js'

const router = express.Router()

// -----------------------------------------------------------------------------
// 🌍 Environment Variables (loaded via dotenv in index.js)
// -----------------------------------------------------------------------------
const stripeSecret = process.env.STRIPE_SECRET_KEY
const emailUser = process.env.EMAIL_USER
const emailFrom = process.env.EMAIL_FROM

const INVENTORY_BLOCKING_STATUSES = ['DRAFT', 'PENDING_PAYMENT', 'PAID', 'CHECKED_IN', 'COMPLETED']
const BOOKING_REQUEST_EXPIRY_MINUTES = Number(process.env.BOOKING_REQUEST_EXPIRY_MINUTES || 120)

function bookingRequestExpiresAt(createdAt) {
  return new Date(createdAt.getTime() + BOOKING_REQUEST_EXPIRY_MINUTES * 60 * 1000)
}

function overlapsRange(existingStart, existingEnd, requestedStart, requestedEnd) {
  return existingStart < requestedEnd && existingEnd > requestedStart
}

async function getReservedUnitsForRange(roomTypeId, start, end, tx = prisma) {
  const overlapping = await tx.booking.findMany({
    where: {
      roomTypeId,
      status: { in: INVENTORY_BLOCKING_STATUSES },
      checkIn: { lt: end },
      checkOut: { gt: start },
    },
    select: { checkIn: true, checkOut: true, rooms: true, status: true, createdAt: true },
  })

  const now = new Date()
  let maxReserved = 0
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dayStart = new Date(d)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)
    let reservedForDay = 0
    for (const b of overlapping) {
      if (b.status === 'DRAFT' && bookingRequestExpiresAt(b.createdAt) <= now) continue
      if (overlapsRange(b.checkIn, b.checkOut, dayStart, dayEnd)) {
        reservedForDay += b.rooms || 1
      }
    }
    if (reservedForDay > maxReserved) maxReserved = reservedForDay
  }
  return maxReserved
}

// -----------------------------------------------------------------------------
// 🧾 CREATE BOOKING
// - REQUEST: creates DRAFT booking request with expiry
// - INSTANT: creates PAID booking (instant payment path)
// -----------------------------------------------------------------------------
router.post('/', authenticateUser, async (req, res) => {
  try {
    const {
      hotelId,
      roomTypeId,
      checkIn,
      checkOut,
      currency = 'USD',
      guests = 1,
      rooms = 1,
      bookingFlow = 'REQUEST',
    } = req.body

    if (!hotelId || !roomTypeId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'hotelId, roomTypeId, checkIn, and checkOut are required' })
    }

    // ✅ Validate and get room data
    const room = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
      include: { hotel: true }
    })

    if (!room || room.hotelId !== hotelId) {
      return res.status(400).json({ error: 'Invalid roomType for selected hotel' })
    }

    // ✅ Validate dates
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    if (isNaN(nights) || nights <= 0) {
      return res.status(400).json({ error: 'Invalid date range' })
    }

    const requestedRooms = Math.max(1, Number(rooms) || 1)
    const totalUnits = room.totalUnits || 1
    if (requestedRooms > totalUnits) {
      return res.status(400).json({
        error: `Only ${totalUnits} room(s) are available for this room type`,
      })
    }

    const reserved = await getReservedUnitsForRange(roomTypeId, start, end)
    const available = Math.max(0, totalUnits - reserved)
    if (requestedRooms > available) {
      return res.status(409).json({
        error: `Only ${available} room(s) left for selected dates`,
      })
    }

    const blocked = await prisma.roomBookingBlock.findFirst({
      where: {
        roomTypeId,
        startDate: { lt: end },
        endDate: { gt: start },
      },
      select: { id: true, startDate: true, endDate: true, reason: true },
    })
    if (blocked) {
      return res.status(409).json({
        error: 'This room is manually paused for selected dates by hotel manager',
        blocked,
      })
    }

    // ✅ Compute total based on rooms × nights × price per night
    const totalAmount = room.pricePerNight * requestedRooms * nights
    const normalizedFlow = String(bookingFlow).toUpperCase() === 'INSTANT' ? 'INSTANT' : 'REQUEST'
    const initialStatus = normalizedFlow === 'INSTANT' ? 'PAID' : 'DRAFT'

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        hotelId,
        roomTypeId,
        checkIn: start,
        checkOut: end,
        currency,
        guests,
        rooms: requestedRooms,
        totalAmount,
        status: initialStatus,
      },
      include: {
        hotel: { select: { id: true, name: true, address: true } },
        roomType: { select: { id: true, name: true, pricePerNight: true } }
      }
    })

    res.status(201).json({
      message: normalizedFlow === 'INSTANT' ? 'Booking confirmed' : 'Booking request created',
      booking,
      bookingFlow: normalizedFlow,
      requestExpiresAt:
        normalizedFlow === 'REQUEST'
          ? bookingRequestExpiresAt(booking.createdAt).toISOString()
          : null,
    })
  } catch (err) {
    console.error('❌ Booking create error:', err)
    res.status(500).json({ error: 'Booking failed' })
  }
})

// -----------------------------------------------------------------------------
// 📋 GET USER BOOKINGS
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// 📋 GET USER BOOKINGS (with hotel & room images)
// -----------------------------------------------------------------------------
router.get('/', authenticateUser, async (req, res) => {
  try {
    const now = new Date()
    const userDrafts = await prisma.booking.findMany({
      where: { userId: req.user.id, status: 'DRAFT' },
      select: { id: true, createdAt: true },
    })
    const expiredIds = userDrafts
      .filter((b) => bookingRequestExpiresAt(b.createdAt) <= now)
      .map((b) => b.id)
    if (expiredIds.length) {
      await prisma.booking.updateMany({
        where: { id: { in: expiredIds }, status: 'DRAFT' },
        data: { status: 'CANCELLED' },
      })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            address: true,
            images: { orderBy: { sortOrder: 'asc' } }, // ✅ Include hotel images
          },
        },
        roomType: {
          select: {
            id: true,
            name: true,
            pricePerNight: true,
            images: { orderBy: { sortOrder: 'asc' } }, // ✅ Include room images
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(
      bookings.map((b) => ({
        ...b,
        requestExpiresAt: b.status === 'DRAFT' ? bookingRequestExpiresAt(b.createdAt).toISOString() : null,
      }))
    );
  } catch (err) {
    console.error('❌ Fetch bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// In-system reminders for current user (unseen only)
router.get('/reminders', authenticateUser, async (req, res) => {
  try {
    const reminders = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
        reminderAt: { not: null },
        reminderSeenAt: null,
        status: { in: ['DRAFT', 'PENDING_PAYMENT'] },
      },
      select: {
        id: true,
        reminderAt: true,
        reminderMessage: true,
        hotel: { select: { name: true } },
        checkIn: true,
        checkOut: true,
        status: true,
      },
      orderBy: { reminderAt: 'desc' },
    })
    res.json(reminders)
  } catch (err) {
    console.error('❌ Reminder list error:', err)
    res.status(500).json({ error: 'Failed to fetch reminders' })
  }
})

router.patch('/:id/reminder-seen', authenticateUser, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } })
    if (!booking || booking.userId !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' })
    }
    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { reminderSeenAt: new Date() },
      select: { id: true, reminderSeenAt: true },
    })
    res.json({ message: 'Reminder marked as seen', booking: updated })
  } catch (err) {
    console.error('❌ Reminder seen update error:', err)
    res.status(500).json({ error: 'Failed to update reminder state' })
  }
})


// -----------------------------------------------------------------------------
// ❌ CANCEL BOOKING (Allowed for DRAFT or PENDING_PAYMENT)
// -----------------------------------------------------------------------------
router.patch('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } })
    if (!booking || booking.userId !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' })
    }

    if (!['DRAFT', 'PENDING_PAYMENT'].includes(booking.status)) {
      return res.status(400).json({ error: 'Cannot cancel booking at this stage' })
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    })

    res.json({ message: 'Booking cancelled', updated })
  } catch (err) {
    console.error('❌ Cancel booking error:', err)
    res.status(500).json({ error: 'Cancellation failed' })
  }
})

// -----------------------------------------------------------------------------
// 💳 PAYMENT SUCCESS (Mock route – real Stripe webhook later)
// -----------------------------------------------------------------------------
router.post('/:id/pay-success', authenticateUser, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { hotel: true, user: true, roomType: true },
    })
    if (!booking || booking.userId !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    if (!['PENDING_PAYMENT', 'DRAFT'].includes(booking.status)) {
      return res.status(400).json({ error: `Cannot pay booking in status ${booking.status}` })
    }

    // If manager already accepted (PENDING_PAYMENT), skip re-check by requirement.
    // If still request-stage (DRAFT), enforce latest availability check at checkout.
    if (booking.status === 'DRAFT') {
      const reserved = await getReservedUnitsForRange(booking.roomTypeId, booking.checkIn, booking.checkOut)
      const totalUnits = booking.roomType?.totalUnits || 1
      const available = Math.max(0, totalUnits - reserved)
      if ((booking.rooms || 1) > available) {
        return res.status(409).json({
          error: 'Room is taken for selected dates. Please change dates or quantity.',
        })
      }

      const blocked = await prisma.roomBookingBlock.findFirst({
        where: {
          roomTypeId: booking.roomTypeId,
          startDate: { lt: booking.checkOut },
          endDate: { gt: booking.checkIn },
        },
        select: { id: true },
      })
      if (blocked) {
        return res.status(409).json({
          error: 'Room is taken for selected dates. Hotel manager paused this range.',
        })
      }
    }

    const paidBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'PAID' },
      include: { hotel: true, user: true, roomType: true, payment: true },
    })

    // Send confirmation email (after payment)
    if (paidBooking.user?.email) {
      await sendBookingConfirmationEmail(paidBooking.user.email, paidBooking)
    }

    res.json({ message: 'Payment confirmed & email sent', booking: paidBooking })
  } catch (err) {
    console.error('❌ Payment success error:', err)
    res.status(500).json({ error: 'Payment confirmation failed' })
  }
})

// -----------------------------------------------------------------------------
// 🏨 MANAGER ACTIONS (Checked-in / Completed)
// -----------------------------------------------------------------------------
router.patch('/:id/status', authenticateUser, async (req, res) => {
  try {
    const { status } = req.body
    const allowedStatuses = ['CHECKED_IN', 'COMPLETED']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status update' })
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    })

    res.json({ message: `Booking marked as ${status}`, updated })
  } catch (err) {
    console.error('❌ Update status error:', err)
    res.status(500).json({ error: 'Status update failed' })
  }
})

// -----------------------------------------------------------------------------
// 🧹 AUTO CANCEL (to be scheduled – not user facing)
// -----------------------------------------------------------------------------
router.post('/auto-cancel', async (_req, res) => {
  try {
    const now = new Date()
    const cancelled = await prisma.booking.updateMany({
      where: {
        status: 'PENDING_PAYMENT',
        checkIn: { lt: now },
      },
      data: { status: 'CANCELLED' },
    })
    res.json({ message: 'Auto cancel completed', count: cancelled.count })
  } catch (err) {
    console.error('❌ Auto cancel error:', err)
    res.status(500).json({ error: 'Auto cancel failed' })
  }
})
// PATCH /bookings/:id - user edits booking request details
router.patch("/:id", authenticateUser, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { roomType: true },
    })
    if (!booking || booking.userId !== req.user.id) {
      return res.status(404).json({ error: "Booking not found or unauthorized" })
    }
    if (booking.status !== "DRAFT") {
      return res.status(400).json({ error: "Accepted pending payment bookings cannot be modified" })
    }

    const { checkIn, checkOut, rooms, guests } = req.body
    const nextCheckIn = checkIn ? new Date(checkIn) : booking.checkIn
    const nextCheckOut = checkOut ? new Date(checkOut) : booking.checkOut
    const nextRooms = Math.max(1, Number(rooms ?? booking.rooms) || 1)
    const nextGuests = Math.max(1, Number(guests ?? booking.guests) || 1)
    const nights = Math.ceil((nextCheckOut - nextCheckIn) / (1000 * 60 * 60 * 24))
    if (!Number.isFinite(nights) || nights <= 0) {
      return res.status(400).json({ error: "Invalid date range" })
    }

    const totalUnits = booking.roomType?.totalUnits || 1
    if (nextRooms > totalUnits) {
      return res.status(400).json({ error: `Only ${totalUnits} room(s) available for this room type` })
    }

    const blocked = await prisma.roomBookingBlock.findFirst({
      where: {
        roomTypeId: booking.roomTypeId,
        startDate: { lt: nextCheckOut },
        endDate: { gt: nextCheckIn },
      },
      select: { id: true },
    })
    if (blocked) {
      return res.status(409).json({ error: "Selected dates are paused by hotel manager" })
    }

    const reserved = await getReservedUnitsForRange(booking.roomTypeId, nextCheckIn, nextCheckOut)
    const reservedExcludingSelf = Math.max(0, reserved - (booking.rooms || 1))
    const available = Math.max(0, totalUnits - reservedExcludingSelf)
    if (nextRooms > available) {
      return res.status(409).json({ error: `Only ${available} room(s) left for selected dates` })
    }

    const recalculatedTotal = (booking.roomType?.pricePerNight || 0) * nextRooms * nights

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        checkIn: nextCheckIn,
        checkOut: nextCheckOut,
        rooms: nextRooms,
        guests: nextGuests,
        totalAmount: recalculatedTotal,
      },
    })

    res.json({ message: "Booking updated successfully", booking: updated })
  } catch (err) {
    console.error("❌ Booking update error:", err)
    res.status(500).json({ error: "Failed to update booking" })
  }
})


export default router
