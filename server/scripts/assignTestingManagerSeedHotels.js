/**
 * Assigns testingmanager@gmail.com as owner of the 10 seed demo hotels, and ensures:
 * - Google Maps embed (lat/lng)
 * - Hotel gallery: cover + 3 extra images (from seed catalog)
 * - At least 2 hotel amenity strip images
 * - Three room types with different capacities and prices (+ 2 photos each)
 * - Text highlights / amenities / room amenities
 *
 * Requires: user testingmanager@gmail.com exists; seed hotels exist (npm run prisma:seed).
 * Run from server: node scripts/assignTestingManagerSeedHotels.js
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { SEED_DEMO_HOTELS } from "../src/data/seedHotelsCatalog.js";

const prisma = new PrismaClient();
const MANAGER_EMAIL = "testingmanager@gmail.com";

const PROPERTY_TYPES = [
  "Resort",
  "City Hotel",
  "Boutique",
  "Eco Lodge",
  "Villa",
  "Guesthouse",
  "Resort",
  "City Hotel",
  "Boutique",
  "Resort",
];

const HIGHLIGHTS = ["Free Wi-Fi", "On-site dining", "24-hour reception"];
const AMENITIES_ARR = [
  "Outdoor pool",
  "Fitness centre",
  "Spa services",
  "Airport shuttle",
  "Concierge",
];
const ROOM_AMENITIES_ARR = [
  "Air conditioning",
  "Smart TV",
  "Tea & coffee",
  "In-room safe",
  "Daily housekeeping",
];

const AMENITY_STRIP_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1000&q=80",
    alt: "Pool & wellness",
  },
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    alt: "Restaurant & dining",
  },
];

function mapEmbed(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  return `https://maps.google.com/maps?q=${la},${ln}&z=15&output=embed`;
}

/** Three rooms: capacities 2, 3, 5 — prices scale by hotel index. */
function roomPlan(hotelIndex) {
  const bump = hotelIndex * 7;
  return [
    {
      name: "Classic Double",
      capacity: 2,
      pricePerNight: 99 + bump,
      description: "Comfortable double room for two guests.",
      imageUrls: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Deluxe Triple",
      capacity: 3,
      pricePerNight: 159 + bump,
      description: "Extra space for three guests with a work desk.",
      imageUrls: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Family Suite",
      capacity: 5,
      pricePerNight: 239 + bump,
      description: "Ideal for families; generous layout and sitting area.",
      imageUrls: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];
}

async function syncHotel(managerId, def, hotelIndex) {
  const exists = await prisma.hotel.findUnique({ where: { id: def.id } });
  if (!exists) {
    console.warn(`Skip missing hotel ${def.id} (${def.name}) — run: npm run prisma:seed`);
    return;
  }
  const embed = mapEmbed(def.latitude, def.longitude);
  const rooms = roomPlan(hotelIndex);

  await prisma.$transaction(async (tx) => {
    await tx.hotel.update({
      where: { id: def.id },
      data: {
        ownerUserId: managerId,
        status: "ACTIVE",
        name: def.name,
        address: def.address,
        latitude: def.latitude,
        longitude: def.longitude,
        mapEmbedUrl: embed,
        propertyType: PROPERTY_TYPES[hotelIndex % PROPERTY_TYPES.length],
        highlights: HIGHLIGHTS,
        amenities: AMENITIES_ARR,
        roomAmenities: ROOM_AMENITIES_ARR,
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        basePrice: rooms[0].pricePerNight,
        overviewTitle: "Hotel overview",
        overview: `Stay at ${def.name} — curated for travellers on Booking Lanka. Enjoy a strong location in Sri Lanka with dependable comfort and friendly service.`,
        description: `${def.name}: well-appointed rooms, clear map location, and amenities suited for leisure or business visits.`,
      },
    });

    await tx.hotelImage.deleteMany({ where: { hotelId: def.id } });
    await tx.hotelImage.createMany({
      data: def.images.map((url, idx) => ({
        hotelId: def.id,
        url,
        isCover: idx === 0,
        sortOrder: idx,
        provider: "url",
        altText: `${def.name} ${idx + 1}`,
      })),
    });

    await tx.hotelAmenityImage.deleteMany({ where: { hotelId: def.id } });
    await tx.hotelAmenityImage.createMany({
      data: AMENITY_STRIP_IMAGES.map((row, i) => ({
        hotelId: def.id,
        url: row.url,
        sortOrder: i,
        provider: "url",
        altText: row.alt,
      })),
    });

    await tx.roomType.deleteMany({ where: { hotelId: def.id } });
    for (const r of rooms) {
      await tx.roomType.create({
        data: {
          hotelId: def.id,
          name: r.name,
          description: r.description,
          capacity: r.capacity,
          pricePerNight: r.pricePerNight,
          totalUnits: 3,
          images: {
            create: r.imageUrls.map((url, imgIdx) => ({
              url,
              isCover: imgIdx === 0,
              sortOrder: imgIdx,
              provider: "url",
              altText: `${r.name} ${imgIdx + 1}`,
            })),
          },
        },
      });
    }
  });

  console.log(`Updated: ${def.name}`);
}

async function main() {
  const manager = await prisma.user.findUnique({
    where: { email: MANAGER_EMAIL },
  });
  if (!manager) {
    console.error(`No user found with email ${MANAGER_EMAIL}. Create the manager account first.`);
    process.exit(1);
  }
  if (!manager.roles.includes("MANAGER")) {
    console.error(`${MANAGER_EMAIL} must have the MANAGER role.`);
    process.exit(1);
  }

  for (let i = 0; i < SEED_DEMO_HOTELS.length; i += 1) {
    await syncHotel(manager.id, SEED_DEMO_HOTELS[i], i);
  }

  const ids = SEED_DEMO_HOTELS.map((h) => h.id);
  const merged = [...new Set([...(manager.hotelIds || []), ...ids])];
  await prisma.user.update({
    where: { id: manager.id },
    data: { hotelIds: merged },
  });

  console.log(`\nLinked ${ids.length} hotel id(s) to ${MANAGER_EMAIL} hotelIds. Done.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
