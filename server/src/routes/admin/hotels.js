import express from "express"
import { prisma } from "../../db/client.js"
import { authenticateAdmin } from "../../middleware/authAdmin.js"

const router = express.Router()

// ✅ List hotels (optional ?status=ACTIVE|DRAFT to split long lists)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const q = req.query.status
    const where =
      q === "ACTIVE" || q === "DRAFT" ? { status: q } : {}

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        owner: { select: { id: true, email: true } },
        rooms: true,
      },
      orderBy: { createdAt: "desc" },
    })
    res.json(hotels)
  } catch (err) {
    console.error("Admin list hotels error:", err)
    res.status(500).json({ error: "Failed to fetch hotels" })
  }
})

// ✅ Approve (activate) a hotel
router.patch("/:id/activate", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const hotel = await prisma.hotel.update({
      where: { id },
      data: { status: "ACTIVE" },
    })
    res.json({ message: "Hotel activated successfully", hotel })
  } catch (err) {
    console.error("Hotel activation error:", err)
    res.status(500).json({ error: "Failed to activate hotel" })
  }
})

// ✅ Deactivate a hotel
router.patch("/:id/deactivate", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const hotel = await prisma.hotel.update({
      where: { id },
      data: { status: "DRAFT" },
    })
    res.json({ message: "Hotel deactivated successfully", hotel })
  } catch (err) {
    console.error("Hotel deactivation error:", err)
    res.status(500).json({ error: "Failed to deactivate hotel" })
  }
})

export default router
