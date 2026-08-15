import { PrismaClient } from "@prisma/client";
import { DEFAULT_DESTINATIONS } from "../src/data/defaultDestinations.js";
import { SEED_DEMO_HOTELS as HOTELS } from "../src/data/seedHotelsCatalog.js";
import { upsertSeedHotel } from "../src/services/seedHotelRecord.js";

const prisma = new PrismaClient();

const DESTINATION_DEMO_IMAGE_URLS = {
  galle: "/uploads/destinations/galle.png",
  colombo: "/uploads/destinations/colombo.png",
  sigiriya: "/uploads/destinations/sigiriya.png",
  "arugam-bay": "/uploads/destinations/arugam-bay.png",
  ella: "/uploads/destinations/ella.png",
  "nuwara-eliya": "/uploads/destinations/nuwara-eliya.png",
  kandy: "/uploads/destinations/kandy.png",
};

async function main() {
  for (let i = 0; i < HOTELS.length; i += 1) {
    await upsertSeedHotel(prisma, HOTELS[i], i);
  }

  for (let i = 0; i < DEFAULT_DESTINATIONS.length; i += 1) {
    const destination = DEFAULT_DESTINATIONS[i];
    const demoUrl = DESTINATION_DEMO_IMAGE_URLS[destination.slug] || null;
    const images = {};
    if (destination.coverImageUrl) {
      images.coverImageUrl = destination.coverImageUrl;
      images.cardImageUrl = destination.cardImageUrl || destination.coverImageUrl;
    } else if (demoUrl) {
      images.coverImageUrl = demoUrl;
      images.cardImageUrl = demoUrl;
    }
    if (destination.galleryImages?.length) {
      images.galleryImages = destination.galleryImages;
    }

    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        ...destination,
        sortOrder: i,
        ...images,
      },
      create: {
        ...destination,
        sortOrder: i,
        ...images,
      },
    });
  }

  console.log(`Seed complete: ${HOTELS.length} Sri Lankan hotels with rooms and destination copy updated.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
