import { Router } from "express";
import { prisma } from "../db/client.js";
import { DEFAULT_DESTINATIONS } from "../data/defaultDestinations.js";

const router = Router();

async function ensureDefaultDestinations() {
  const count = await prisma.destination.count();
  if (count > 0) return;

  await prisma.destination.createMany({
    data: DEFAULT_DESTINATIONS.map((d, index) => ({
      ...d,
      sortOrder: index,
      isActive: true,
    })),
  });
}

function mapHotelListRow(hotel) {
  return {
    id: hotel.id,
    name: hotel.name,
    address: hotel.address,
    propertyType: hotel.propertyType || null,
    coverImage: hotel.images[0]?.url || null,
    minCapacity:
      hotel.rooms.length > 0 ? Math.min(...hotel.rooms.map((r) => r.capacity)) : null,
    maxCapacity:
      hotel.rooms.length > 0 ? Math.max(...hotel.rooms.map((r) => r.capacity)) : null,
    minPrice:
      hotel.rooms.length > 0 ? Math.min(...hotel.rooms.map((r) => r.pricePerNight)) : null,
    maxPrice:
      hotel.rooms.length > 0 ? Math.max(...hotel.rooms.map((r) => r.pricePerNight)) : null,
  };
}

function buildLocationTerms(town, district) {
  const terms = [town, district].map((v) => String(v || "").trim()).filter(Boolean);
  if (!terms.length) return null;
  return Array.from(new Set(terms));
}

function buildHotelAddressWhere(town, district) {
  const terms = buildLocationTerms(town, district);
  if (!terms) return null;
  return {
    OR: terms.map((term) => ({
      address: { contains: term, mode: "insensitive" },
    })),
  };
}

router.get("/", async (_req, res) => {
  try {
    await ensureDefaultDestinations();

    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        district: true,
        town: true,
        region: true,
        bestFor: true,
        mapEmbedUrl: true,
        coverImageUrl: true,
        cardImageUrl: true,
      },
    });

    const enriched = await Promise.all(
      destinations.map(async (destination) => {
        const addressWhere = buildHotelAddressWhere(destination.town, destination.district);
        const hotelsCount = addressWhere
          ? await prisma.hotel.count({
              where: {
                status: "ACTIVE",
                ...addressWhere,
              },
            })
          : 0;

        return {
          ...destination,
          hotelsCount,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("Destinations list error:", err);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    await ensureDefaultDestinations();

    const slug = String(req.params.slug || "").toLowerCase().trim();
    const destination = await prisma.destination.findFirst({
      where: { slug, isActive: true },
    });

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const addressWhere = buildHotelAddressWhere(destination.town, destination.district);
    const nearbyHotels = addressWhere
      ? await prisma.hotel.findMany({
          where: {
            status: "ACTIVE",
            ...addressWhere,
          },
          include: {
            images: { where: { isCover: true }, take: 1 },
            rooms: true,
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        })
      : [];

    res.json({
      ...destination,
      nearbyHotels: nearbyHotels.map(mapHotelListRow),
    });
  } catch (err) {
    console.error("Destination details error:", err);
    res.status(500).json({ error: "Failed to fetch destination details" });
  }
});

export default router;
