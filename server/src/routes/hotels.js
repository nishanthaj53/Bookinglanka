// server/src/routes/hotels.js
import { Router } from "express";
import { prisma } from "../db/client.js";

const router = Router();

function mapHotelListRow(h) {
  const imgs = h.images || [];
  const coverUrl = imgs.find((img) => img.isCover)?.url || imgs[0]?.url || null;
  return {
    id: h.id,
    name: h.name,
    address: h.address,
    propertyType: h.propertyType || null,
    coverImage: coverUrl,
    minCapacity: h.rooms.length > 0 ? Math.min(...h.rooms.map((r) => r.capacity)) : null,
    maxCapacity: h.rooms.length > 0 ? Math.max(...h.rooms.map((r) => r.capacity)) : null,
    minPrice: h.rooms.length > 0 ? Math.min(...h.rooms.map((r) => r.pricePerNight)) : null,
    maxPrice: h.rooms.length > 0 ? Math.max(...h.rooms.map((r) => r.pricePerNight)) : null,
  };
}

// GET /hotels - list or search hotels
// GET /hotels?city=colombo&capacity=2&minPrice=100&maxPrice=300&keyword=beach&propertyType=Resort
router.get("/", async (req, res) => {
  try {
    const { city, capacity, minPrice, maxPrice, keyword, propertyType } = req.query;

    const roomAnd = [];
    if (capacity) {
      const n = Number(capacity);
      if (Number.isFinite(n) && n > 0) {
        roomAnd.push({ capacity: { gte: n } });
      }
    }
    const priceFilter = {};
    if (minPrice != null && String(minPrice).trim() !== "") {
      const minN = Number(minPrice);
      if (Number.isFinite(minN) && minN >= 0) priceFilter.gte = minN;
    }
    if (maxPrice != null && String(maxPrice).trim() !== "") {
      const maxN = Number(maxPrice);
      if (Number.isFinite(maxN) && maxN >= 0) priceFilter.lte = maxN;
    }
    if (Object.keys(priceFilter).length) {
      roomAnd.push({ pricePerNight: priceFilter });
    }

    const hotels = await prisma.hotel.findMany({
      where: {
        status: "ACTIVE",
        ...(city && String(city).trim()
          ? { address: { contains: String(city).trim(), mode: "insensitive" } }
          : {}),
        ...(propertyType && String(propertyType).trim()
          ? { propertyType: { equals: String(propertyType).trim(), mode: "insensitive" } }
          : {}),
        ...(keyword && String(keyword).trim()
          ? {
              OR: [
                { name: { contains: String(keyword).trim(), mode: "insensitive" } },
                { address: { contains: String(keyword).trim(), mode: "insensitive" } },
                { description: { contains: String(keyword).trim(), mode: "insensitive" } },
              ],
            }
          : {}),
        ...(roomAnd.length ? { rooms: { some: { AND: roomAnd } } } : {}),
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 12 },
        rooms: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(hotels.map(mapHotelListRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /hotels/:id/nearby — linked places (cached distances)
router.get("/:id/nearby", async (req, res) => {
  try {
    const { id } = req.params;
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"), 10) || 20));

    const hotel = await prisma.hotel.findFirst({
      where: { id, status: "ACTIVE" },
      select: { id: true },
    });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const links = await prisma.hotelNearbyPlace.findMany({
      where: { hotelId: id },
      include: { place: true },
      orderBy: { distanceMeters: "asc" },
      take: limit,
    });

    res.json(
      links.map((l) => ({
        ...l.place,
        distanceMeters: l.distanceMeters,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /hotels/:id/availability?month=YYYY-MM
// Returns per-day booked/free room units for each room type.
// Includes accepted pending payments so users see near-real occupancy.
router.get("/:id/availability", async (req, res) => {
  try {
    const { id } = req.params;
    const month = String(req.query.month || "");
    const monthMatch = /^(\d{4})-(\d{2})$/.exec(month);
    if (!monthMatch) return res.status(400).json({ error: "month must be YYYY-MM" });

    const year = Number(monthMatch[1]);
    const monthIndex = Number(monthMatch[2]) - 1;
    if (monthIndex < 0 || monthIndex > 11) {
      return res.status(400).json({ error: "Invalid month value" });
    }

    const hotel = await prisma.hotel.findFirst({
      where: { id, status: "ACTIVE" },
      include: {
        rooms: {
          select: { id: true, name: true, totalUnits: true },
          orderBy: { name: "asc" },
        },
      },
    });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const monthStart = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const monthEnd = new Date(year, monthIndex + 1, 1, 0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: id,
        status: { in: ["PENDING_PAYMENT", "PAID", "CHECKED_IN", "COMPLETED"] },
        checkIn: { lt: monthEnd },
        checkOut: { gt: monthStart },
      },
      select: {
        roomTypeId: true,
        rooms: true,
        checkIn: true,
        checkOut: true,
      },
    });

    const roomTypeIds = hotel.rooms.map((r) => r.id);
    const blocks = await prisma.roomBookingBlock.findMany({
      where: {
        roomTypeId: { in: roomTypeIds },
        startDate: { lt: monthEnd },
        endDate: { gt: monthStart },
      },
      select: { roomTypeId: true, startDate: true, endDate: true },
    });

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const byRoomType = hotel.rooms.map((room) => {
      const dayRows = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStart = new Date(year, monthIndex, d, 0, 0, 0, 0);
        const dayEnd = new Date(year, monthIndex, d + 1, 0, 0, 0, 0);
        let booked = 0;
        for (const b of bookings) {
          if (b.roomTypeId !== room.id) continue;
          if (b.checkIn < dayEnd && b.checkOut > dayStart) booked += b.rooms || 1;
        }
        const isBlocked = blocks.some(
          (blk) =>
            blk.roomTypeId === room.id &&
            blk.startDate < dayEnd &&
            blk.endDate > dayStart
        );
        const free = isBlocked ? 0 : Math.max(0, (room.totalUnits || 1) - booked);
        const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        dayRows.push({ date: key, booked, free, total: room.totalUnits || 1, blocked: isBlocked });
      }
      return {
        roomTypeId: room.id,
        roomName: room.name,
        totalUnits: room.totalUnits || 1,
        days: dayRows,
      };
    });

    res.json({
      hotelId: id,
      month,
      roomTypes: byRoomType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /hotels/:id - single hotel details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await prisma.hotel.findFirst({
      where: { id, status: "ACTIVE" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenityImages: { orderBy: { sortOrder: "asc" } },
        rooms: {
          include: { images: { orderBy: { sortOrder: "asc" } }, amenityImages: { orderBy: { sortOrder: "asc" } } },
          orderBy: { pricePerNight: "asc" },
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
