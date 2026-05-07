import express from "express"
import { prisma } from "../../db/client.js"
import { authenticateAdmin } from "../../middleware/authAdmin.js"

const router = express.Router()

// ✅ Get all bookings (platform-wide)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, email: true } },
        hotel: { select: { id: true, name: true } },
        roomType: { select: { id: true, name: true, pricePerNight: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    res.json(bookings)
  } catch (err) {
    console.error("Admin list bookings error:", err)
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
})

// ✅ Change booking status (optional)
router.patch("/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = [
      "DRAFT",
      "PENDING_PAYMENT",
      "PAID",
      "CHECKED_IN",
      "CHECKED_OUT",
      "CANCELLED",
    ]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid booking status" })
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    })
    res.json({ message: "Booking status updated", booking: updated })
  } catch (err) {
    console.error("Admin update booking error:", err)
    res.status(500).json({ error: "Failed to update booking" })
  }
})

export default router
