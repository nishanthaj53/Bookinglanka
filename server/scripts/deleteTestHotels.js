/**
 * Removes demo hotels created by prisma/seed.js (fixed UUID prefix).
 * Cascades: room types, images, bookings, commission rules, nearby links, etc.
 * Also strips those IDs from User.hotelIds.
 *
 * Run from server folder: node scripts/deleteTestHotels.js
 * (Requires DATABASE_URL — same as the API.)
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Same prefix as every hotel `id` in prisma/seed.js `HOTELS`. */
const SEED_HOTEL_ID_PREFIX = "f1b9ab1a-0d01-4f24-a001-";

async function main() {
  const toRemove = await prisma.hotel.findMany({
    where: { id: { startsWith: SEED_HOTEL_ID_PREFIX } },
    select: { id: true, name: true },
  });

  if (toRemove.length === 0) {
    console.log("No seed-pattern hotels found (nothing to delete).");
    return;
  }

  const idSet = new Set(toRemove.map((h) => h.id));
  console.log(`Deleting ${toRemove.length} seed hotel(s):`);
  for (const h of toRemove) console.log(`  - ${h.name} (${h.id})`);

  const users = await prisma.user.findMany({ select: { id: true, hotelIds: true } });
  let usersUpdated = 0;
  for (const u of users) {
    const next = u.hotelIds.filter((id) => !idSet.has(id));
    if (next.length === u.hotelIds.length) continue;
    await prisma.user.update({
      where: { id: u.id },
      data: { hotelIds: next },
    });
    usersUpdated += 1;
  }
  if (usersUpdated) console.log(`Updated hotelIds on ${usersUpdated} user(s).`);

  const res = await prisma.hotel.deleteMany({
    where: { id: { startsWith: SEED_HOTEL_ID_PREFIX } },
  });

  console.log(`Done. Removed ${res.count} hotel row(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
