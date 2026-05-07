import { PrismaClient } from "@prisma/client";
import { DEFAULT_DESTINATIONS } from "../src/data/defaultDestinations.js";
import {
  SEED_DEMO_HOTELS as HOTELS,
  SEED_DEFAULT_ROOM_TEMPLATES as DEFAULT_ROOM_TEMPLATES,
} from "../src/data/seedHotelsCatalog.js";

const prisma = new PrismaClient();

/** Demo assets in server/uploads/destinations — same URL for cover + card until admin replaces. */
const DESTINATION_DEMO_IMAGE_URLS = {
  galle: "/uploads/destinations/galle.png",
  colombo: "/uploads/destinations/colombo.png",
  sigiriya: "/uploads/destinations/sigiriya.png",
  "arugam-bay": "/uploads/destinations/arugam-bay.png",
  jaffna: "/uploads/destinations/jaffna.png",
  ella: "/uploads/destinations/ella.png",
  "nuwara-eliya": "/uploads/destinations/nuwara-eliya.png",
  kandy: "/uploads/destinations/kandy.png",
};

async function seedOneHotel(hotel, indexOffset = 0) {
  await prisma.hotel.upsert({
    where: { id: hotel.id },
    update: {
      name: hotel.name,
      address: hotel.address,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      status: "ACTIVE",
    },
    create: {
      id: hotel.id,
      name: hotel.name,
      address: hotel.address,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      status: "ACTIVE",
    },
  });

  await prisma.hotelImage.deleteMany({ where: { hotelId: hotel.id } });
  await prisma.roomType.deleteMany({ where: { hotelId: hotel.id } });

  await prisma.hotelImage.createMany({
    data: hotel.images.map((url, idx) => ({
      hotelId: hotel.id,
      url,
      isCover: idx === 0,
      sortOrder: idx,
      provider: "url",
      altText: `${hotel.name} image ${idx + 1}`,
    })),
  });

  for (let i = 0; i < DEFAULT_ROOM_TEMPLATES.length; i += 1) {
    const room = DEFAULT_ROOM_TEMPLATES[i];
    await prisma.roomType.create({
      data: {
        id: `f71ce6a1-ae9e-47f8-af69-${String(indexOffset + 1).padStart(3, "0")}${String(i + 1).padStart(3, "0")}`,
        hotelId: hotel.id,
        name: room.name,
        description: room.description,
        capacity: room.capacity,
        pricePerNight: room.pricePerNight + indexOffset * 3,
        images: {
          create: room.images.map((url, imgIdx) => ({
            url,
            isCover: imgIdx === 0,
            sortOrder: imgIdx,
            provider: "url",
            altText: `${room.name} image ${imgIdx + 1}`,
          })),
        },
      },
    });
  }
}

async function main() {
  for (let i = 0; i < HOTELS.length; i += 1) {
    await seedOneHotel(HOTELS[i], i);
  }

  for (let i = 0; i < DEFAULT_DESTINATIONS.length; i += 1) {
    const destination = DEFAULT_DESTINATIONS[i];
    const demoUrl = DESTINATION_DEMO_IMAGE_URLS[destination.slug] || null;
    const demoImages = demoUrl
      ? { coverImageUrl: demoUrl, cardImageUrl: demoUrl }
      : {};
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        ...destination,
        sortOrder: i,
        ...demoImages,
      },
      create: {
        ...destination,
        sortOrder: i,
        ...demoImages,
      },
    });
  }

  console.log("Seed complete: 10 Sri Lankan hotels with images and rooms created/updated.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
