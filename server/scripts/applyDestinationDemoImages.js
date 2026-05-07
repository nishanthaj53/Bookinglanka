/**
 * One-off / demo: set cover + card image URLs for default destinations.
 * Expects PNGs under server/uploads/destinations/ (see repo after copy).
 * Run: node scripts/applyDestinationDemoImages.js
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Same file for hero carousel + list tiles (demo); admin can split later. */
const SLUG_TO_PATH = {
  galle: "/uploads/destinations/galle.png",
  colombo: "/uploads/destinations/colombo.png",
  sigiriya: "/uploads/destinations/sigiriya.png",
  "arugam-bay": "/uploads/destinations/arugam-bay.png",
  jaffna: "/uploads/destinations/jaffna.png",
  ella: "/uploads/destinations/ella.png",
  "nuwara-eliya": "/uploads/destinations/nuwara-eliya.png",
  kandy: "/uploads/destinations/kandy.png",
};

async function main() {
  for (const [slug, url] of Object.entries(SLUG_TO_PATH)) {
    const res = await prisma.destination.updateMany({
      where: { slug },
      data: { coverImageUrl: url, cardImageUrl: url },
    });
    console.log(`${slug}: updated ${res.count} row(s) -> ${url}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
