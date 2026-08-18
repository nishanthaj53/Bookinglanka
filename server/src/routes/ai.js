import { Router } from "express";
import { prisma } from "../db/client.js";
import { DEFAULT_DESTINATIONS } from "../data/defaultDestinations.js";

const router = Router();
const geocodeCache = new Map();
const DEFAULT_AIRPORT = {
  code: "CMB",
  name: "Bandaranaike International Airport",
  lat: 7.1808,
  lon: 79.8841,
};

const SL_COORDS = {
  jaffna: { lat: 9.6615, lon: 80.0255 },
  kandy: { lat: 7.2906, lon: 80.6337 },
  ella: { lat: 6.8667, lon: 81.0466 },
  galle: { lat: 6.0329, lon: 80.217 },
  sigiriya: { lat: 7.957, lon: 80.7603 },
  "arugam-bay": { lat: 6.8404, lon: 81.836 },
  colombo: { lat: 6.9271, lon: 79.8612 },
  trincomalee: { lat: 8.5874, lon: 81.2152 },
  "nuwara-eliya": { lat: 6.9497, lon: 80.7891 },
};

const ISLAND_SPREAD = ["sigiriya", "kandy", "ella", "galle", "arugam-bay", "jaffna", "trincomalee"];

function pickTopByInterest(destinations, interests, days = 10) {
  if (!Array.isArray(destinations) || destinations.length === 0) return [];
  const normalizedInterests = (interests || []).map((i) => String(i).toLowerCase().trim()).filter(Boolean);

  const scored = [...destinations]
    .map((d) => {
      const hay = `${d.name || ""} ${d.bestFor || ""} ${d.overview || ""} ${d.whyVisit || ""}`.toLowerCase();
      const score = normalizedInterests.reduce(
        (acc, term) => (hay.includes(term) ? acc + 2 : acc),
        0
      );
      return { ...d, _score: score };
    })
    .sort((a, b) => b._score - a._score || (a.sortOrder || 0) - (b.sortOrder || 0));

  const picked = [];
  const used = new Set();
  for (const d of scored) {
    if (picked.length >= 5) break;
    picked.push(d);
    used.add(d.slug);
  }
  const bySlug = new Map(destinations.map((d) => [d.slug, d]));
  if (Number(days) >= 7 && bySlug.get("jaffna") && !used.has("jaffna")) {
    picked.push(bySlug.get("jaffna"));
    used.add("jaffna");
  }
  for (const slug of ISLAND_SPREAD) {
    if (picked.length >= 6) break;
    const d = bySlug.get(slug);
    if (d && !used.has(slug)) {
      picked.push(d);
      used.add(slug);
    }
  }
  return picked.length ? picked : destinations.slice(0, 4);
}

function mapHotelCard(h) {
  const cheapestRoom = [...(h.rooms || [])].sort(
    (a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0)
  )[0];
  return {
    id: h.id,
    name: h.name,
    address: h.address,
    coverImage: h.images[0]?.url || null,
    minPrice: cheapestRoom?.pricePerNight ?? null,
    roomTypeId: cheapestRoom?.id ?? null,
    roomName: cheapestRoom?.name ?? null,
  };
}

async function geocodeSriLankaLocation(query, slug) {
  const slugKey = String(slug || "").trim().toLowerCase();
  if (slugKey && SL_COORDS[slugKey]) return SL_COORDS[slugKey];
  const nameKey = String(query || "").trim().toLowerCase();
  if (nameKey && SL_COORDS[nameKey]) return SL_COORDS[nameKey];
  const key = String(query || "").trim().toLowerCase();
  if (!key) return null;
  if (geocodeCache.has(key)) return geocodeCache.get(key);
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("q", `${query}, Sri Lanka`);
    url.searchParams.set("limit", "1");
    const upstream = await fetch(url.toString(), {
      headers: {
        "User-Agent": "BookingLanka-TripPlanner/1.0",
        Accept: "application/json",
      },
    });
    if (!upstream.ok) return null;
    const data = await upstream.json();
    const first = Array.isArray(data) ? data[0] : null;
    const point =
      first && first.lat && first.lon
        ? { lat: Number(first.lat), lon: Number(first.lon) }
        : null;
    geocodeCache.set(key, point);
    return point;
  } catch {
    return null;
  }
}

async function buildRouteMap(itinerary, destinations) {
  const destinationBySlug = new Map(
    (destinations || []).map((d) => [String(d.slug || "").toLowerCase(), d])
  );
  const stops = [
    {
      type: "airport",
      label: `${DEFAULT_AIRPORT.code} Arrival`,
      dayStart: 0,
      dayEnd: 0,
      lat: DEFAULT_AIRPORT.lat,
      lon: DEFAULT_AIRPORT.lon,
    },
  ];

  let current = null;
  for (const item of itinerary || []) {
    const slug = String(item.destinationSlug || "").toLowerCase();
    if (!current || current.slug !== slug) {
      current = {
        slug,
        name: item.destinationName,
        dayStart: item.day,
        dayEnd: item.day,
      };
      stops.push(current);
    } else {
      current.dayEnd = item.day;
    }
  }

  for (let i = 1; i < stops.length; i += 1) {
    const stop = stops[i];
    const d = destinationBySlug.get(stop.slug);
    const query = d?.town || d?.district || d?.name || stop.name;
    const point = await geocodeSriLankaLocation(query, stop.slug);
    if (!point) continue;
    stop.lat = point.lat;
    stop.lon = point.lon;
    stop.label = `Day ${stop.dayStart}${stop.dayEnd > stop.dayStart ? `-${stop.dayEnd}` : ""}: ${stop.name}`;
    stop.type = "destination";
  }

  const validDestinationStops = stops.filter(
    (s) => s.type === "destination" && Number.isFinite(s.lat) && Number.isFinite(s.lon)
  );
  const validStops = [
    stops[0],
    ...validDestinationStops,
    {
      type: "airport",
      label: `${DEFAULT_AIRPORT.code} Departure`,
      dayStart: (itinerary || []).length + 1,
      dayEnd: (itinerary || []).length + 1,
      lat: DEFAULT_AIRPORT.lat,
      lon: DEFAULT_AIRPORT.lon,
    },
  ];

  return {
    airport: DEFAULT_AIRPORT,
    stops: validStops,
  };
}

function parseDateOnly(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildDestinationSegments(itinerary) {
  const segments = [];
  let current = null;
  for (const item of itinerary || []) {
    const key = item.destinationSlug || String(item.destinationName || "").toLowerCase();
    if (!current || current.destinationKey !== key) {
      current = {
        destinationKey: key,
        destinationName: item.destinationName || key,
        nights: 1,
      };
      segments.push(current);
    } else {
      current.nights += 1;
    }
  }
  return segments;
}

async function isRoomAvailableForRange(roomTypeId, checkIn, checkOut) {
  const room = await prisma.roomType.findUnique({
    where: { id: roomTypeId },
    select: { id: true, totalUnits: true },
  });
  if (!room) return false;

  const blocked = await prisma.roomBookingBlock.findFirst({
    where: {
      roomTypeId,
      startDate: { lt: checkOut },
      endDate: { gt: checkIn },
    },
    select: { id: true },
  });
  if (blocked) return false;

  const reservedRows = await prisma.booking.findMany({
    where: {
      roomTypeId,
      status: { in: ["DRAFT", "PENDING_PAYMENT", "PAID", "CHECKED_IN", "COMPLETED"] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
    select: { rooms: true },
  });
  const reserved = reservedRows.reduce((sum, b) => sum + Number(b.rooms || 1), 0);
  return reserved < Number(room.totalUnits || 1);
}

function buildFallbackPlan({ days, destinations, hotelsBySlug }) {
  const picks = destinations.slice(0, Math.max(1, Math.min(4, destinations.length)));
  const daysSafe = Math.max(2, Math.min(30, Number(days) || 10));
  const blocks = picks.length;
  const base = Math.floor(daysSafe / blocks);
  let extra = daysSafe % blocks;
  let dayNo = 1;
  const itinerary = [];
  const recommendedHotels = [];

  for (const destination of picks) {
    const stayDays = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;

    const localHotels = (hotelsBySlug[destination.slug] || []).slice(0, 2);
    for (const h of localHotels) {
      recommendedHotels.push({
        ...h,
        destinationSlug: destination.slug,
        destinationName: destination.name,
        reason: `Recommended for ${destination.name} based on nearby active hotel listing.`,
      });
    }

    for (let i = 0; i < stayDays; i += 1) {
      itinerary.push({
        day: dayNo,
        destinationSlug: destination.slug,
        destinationName: destination.name,
        plan:
          i === 0
            ? `Arrive in ${destination.name}, explore key attractions and local food.`
            : `Continue experience in ${destination.name} with relaxed sightseeing and activities.`,
      });
      dayNo += 1;
    }
  }

  return {
    source: "fallback",
    summary: `A ${daysSafe}-day Sri Lanka plan across ${picks.length} destinations based on your interests.`,
    recommendedDestinations: picks.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      district: d.district,
      town: d.town,
      reason: d.bestFor || "Strong match for your preferences.",
    })),
    recommendedHotels,
    itinerary: itinerary.slice(0, daysSafe),
    tips: [
      "Keep 1 buffer day for weather and travel delays.",
      "Book intercity transport early in peak seasons.",
      "Choose hotels close to your day activities to reduce travel time.",
    ],
  };
}

async function ensureDefaultDestinations() {
  const count = await prisma.destination.count();
  if (count > 0) return;
  await prisma.destination.createMany({
    data: DEFAULT_DESTINATIONS.map((d, index) => ({
      ...d,
      sortOrder: index,
      isActive: true,
    })),
    skipDuplicates: true,
  });
}

async function tryOpenAIPlan(payload, context) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const prompt = `You are a Sri Lanka trip planner for Booking Lanka.
Return ONLY valid JSON with keys:
summary, recommendedDestinations, recommendedHotels, itinerary, tips.
Use ONLY destinations and hotels from the supplied context.
No markdown.

User input:
${JSON.stringify(payload)}

Context:
${JSON.stringify(context)}`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: prompt,
      max_output_tokens: 1200,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const text =
    data?.output_text ||
    data?.output?.map((o) => o?.content?.map((c) => c?.text).join(" ")).join(" ") ||
    "";
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

router.post("/trip-plan", async (req, res) => {
  try {
    await ensureDefaultDestinations();

    const days = Math.max(2, Math.min(30, Number(req.body?.days) || 10));
    const interestsRaw = req.body?.interests;
    const interests = Array.isArray(interestsRaw)
      ? interestsRaw.map((x) => String(x).trim()).filter(Boolean)
      : String(interestsRaw || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);

    const budget = String(req.body?.budget || "").trim();
    const travelStyle = String(req.body?.travelStyle || "").trim();

    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    const picked = pickTopByInterest(destinations, interests, days);
    const hotelsBySlug = {};
    for (const d of picked) {
      const terms = [d.town, d.district].map((x) => String(x || "").trim()).filter(Boolean);
      const hotels = terms.length
        ? await prisma.hotel.findMany({
            where: {
              status: "ACTIVE",
              OR: terms.map((term) => ({
                address: { contains: term, mode: "insensitive" },
              })),
            },
            include: {
              images: { where: { isCover: true }, take: 1 },
              rooms: true,
            },
            orderBy: { createdAt: "desc" },
            take: 6,
          })
        : [];
      hotelsBySlug[d.slug] = hotels.map(mapHotelCard);
    }

    const payload = { days, interests, budget, travelStyle };
    const context = {
      destinations: picked.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        district: d.district,
        town: d.town,
        bestFor: d.bestFor,
      })),
      hotelsByDestination: hotelsBySlug,
    };

    const aiPlan = await tryOpenAIPlan(payload, context);
    const routeMap = await buildRouteMap(
      Array.isArray(aiPlan?.itinerary) ? aiPlan.itinerary : [],
      picked
    );
    if (aiPlan && typeof aiPlan === "object") {
      const contextHotels = Object.values(hotelsBySlug).flat();
      const contextHotelMap = new Map(contextHotels.map((h) => [h.id, h]));
      const mergedHotels = (Array.isArray(aiPlan.recommendedHotels)
        ? aiPlan.recommendedHotels
        : []
      ).map((h) => {
        const base = contextHotelMap.get(h.id) || {};
        return { ...base, ...h };
      });
      return res.json({
        source: "ai",
        ...aiPlan,
        recommendedHotels: mergedHotels,
        map: routeMap,
      });
    }

    const fallback = buildFallbackPlan({
      days,
      destinations: picked,
      hotelsBySlug,
    });
    fallback.map = await buildRouteMap(fallback.itinerary, picked);
    res.json(fallback);
  } catch (err) {
    console.error("Trip plan error:", err);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

router.post("/trip-plan/filter-available", async (req, res) => {
  try {
    const itinerary = Array.isArray(req.body?.itinerary) ? req.body.itinerary : [];
    const recommendedHotels = Array.isArray(req.body?.recommendedHotels)
      ? req.body.recommendedHotels
      : [];
    const startDate = parseDateOnly(req.body?.startDate);

    if (!startDate) {
      return res.status(400).json({ error: "Valid startDate is required" });
    }

    const segments = buildDestinationSegments(itinerary);
    let cursor = new Date(startDate);
    const ranges = new Map();
    for (const seg of segments) {
      const checkIn = new Date(cursor);
      const checkOut = addDays(checkIn, seg.nights);
      ranges.set(seg.destinationKey, { checkIn, checkOut });
      cursor = checkOut;
    }

    const availableHotels = [];
    const unavailableHotels = [];
    for (const hotel of recommendedHotels) {
      const key =
        hotel.destinationSlug ||
        String(hotel.destinationName || "").toLowerCase() ||
        String(hotel.destination || "").toLowerCase();
      const range = ranges.get(key);
      if (!range || !hotel.roomTypeId) {
        unavailableHotels.push({
          ...hotel,
          reason: "Missing mapped room or destination schedule",
        });
        continue;
      }
      const ok = await isRoomAvailableForRange(
        hotel.roomTypeId,
        range.checkIn,
        range.checkOut
      );
      if (ok) {
        availableHotels.push(hotel);
      } else {
        unavailableHotels.push({
          ...hotel,
          reason: "Paused by manager or fully reserved for selected dates",
        });
      }
    }

    res.json({
      availableHotels,
      unavailableHotels,
    });
  } catch (err) {
    console.error("Trip availability filter error:", err);
    res.status(500).json({ error: "Failed to filter available hotels" });
  }
});

export default router;
