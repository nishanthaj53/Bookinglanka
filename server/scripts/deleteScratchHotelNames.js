/**
 * Deletes non-seed hotels whose names match the demo scratch list (case/spacing insensitive).
 * Never deletes prisma/seed.js hotels (id prefix f1b9ab1a-0d01-4f24-a001-).
 *
 * Run: cd server && node scripts/deleteScratchHotelNames.js
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { SEED_HOTEL_ID_PREFIX, isScratchHotelCandidate } from "./scratchHotelNames.js";

const prisma = new PrismaClient();

async function main() {
  const nonSeed = await prisma.hotel.findMany({
    where: { NOT: { id: { startsWith: SEED_HOTEL_ID_PREFIX } } },
    select: { id: true, name: true },
  });

  const toRemove = nonSeed.filter((h) => isScratchHotelCandidate(h));

  if (toRemove.length === 0) {
    console.log("No matching hotels found (already removed or names differ).");
    return;
  }

  const idSet = new Set(toRemove.map((h) => h.id));
  console.log(`Deleting ${toRemove.length} hotel(s):`);
  for (const h of toRemove) console.log(`  - ${h.name} (${h.id})`);

  const users = await prisma.user.findMany({ select: { id: true, hotelIds: true } });
  for (const u of users) {
    const next = u.hotelIds.filter((id) => !idSet.has(id));
    if (next.length === u.hotelIds.length) continue;
    await prisma.user.update({
      where: { id: u.id },
      data: { hotelIds: next },
    });
  }

  await prisma.hotel.deleteMany({ where: { id: { in: [...idSet] } } });
  console.log(`Done. Removed ${idSet.size} row(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
