import { prisma } from "../db/client.js";
import { DEFAULT_DESTINATIONS } from "../data/defaultDestinations.js";
import { SEED_DEMO_HOTELS } from "../data/seedHotelsCatalog.js";
import { upsertSeedHotel } from "./seedHotelRecord.js";

const LOCAL_DESTINATION_IMAGES = {
  galle: "/uploads/destinations/galle.png",
  colombo: "/uploads/destinations/colombo.png",
  sigiriya: "/uploads/destinations/sigiriya.png",
  "arugam-bay": "/uploads/destinations/arugam-bay.png",
  ella: "/uploads/destinations/ella.png",
  "nuwara-eliya": "/uploads/destinations/nuwara-eliya.png",
  kandy: "/uploads/destinations/kandy.png",
};

let ran = false;

export async function ensureDemoCatalog() {
  if (ran) return;
  ran = true;

  for (let i = 0; i < DEFAULT_DESTINATIONS.length; i += 1) {
    const destination = DEFAULT_DESTINATIONS[i];
    const localUrl = LOCAL_DESTINATION_IMAGES[destination.slug] || null;
    const images = {};
    if (destination.coverImageUrl) {
      images.coverImageUrl = destination.coverImageUrl;
      images.cardImageUrl = destination.cardImageUrl || destination.coverImageUrl;
    } else if (localUrl) {
      images.coverImageUrl = localUrl;
      images.cardImageUrl = localUrl;
    }
    if (destination.galleryImages?.length) {
      images.galleryImages = destination.galleryImages;
    }

    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        name: destination.name,
        district: destination.district,
        town: destination.town,
        region: destination.region,
        bestFor: destination.bestFor,
        overview: destination.overview,
        whyVisit: destination.whyVisit,
        mapEmbedUrl: destination.mapEmbedUrl || undefined,
        faqs: destination.faqs || undefined,
        sortOrder: i,
        isActive: true,
        ...images,
      },
      create: {
        ...destination,
        sortOrder: i,
        isActive: true,
        ...images,
      },
    });
  }

  for (let i = 0; i < SEED_DEMO_HOTELS.length; i += 1) {
    const hotel = SEED_DEMO_HOTELS[i];
    const exists = await prisma.hotel.findUnique({ where: { id: hotel.id }, select: { id: true } });
    const isJaffna = String(hotel.address || "").toLowerCase().includes("jaffna");
    if (!exists || isJaffna) {
      await upsertSeedHotel(prisma, hotel, i);
    }
  }
}
