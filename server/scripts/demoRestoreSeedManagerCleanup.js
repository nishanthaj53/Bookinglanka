/**
 * Demo prep:
 * 1) Re-run prisma seed (restores 10 fixed-ID Sri Lanka hotels + destinations).
 * 2) Set primary manager login to testingmanager@gmail.com (oldest MANAGER user, or create one).
 * 3) Delete scratch hotels by name (never touches seed IDs f1b9ab1a-0d01-4f24-a001-*).
 *
 * Run from server: node scripts/demoRestoreSeedManagerCleanup.js
 * Password if a new manager is created: ManagerDemo2026!
 */
import "dotenv/config";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { SEED_HOTEL_ID_PREFIX, isScratchHotelCandidate } from "./scratchHotelNames.js";

const prisma = new PrismaClient();
const MANAGER_EMAIL = "testingmanager@gmail.com";
const NEW_MANAGER_PASSWORD = "ManagerDemo2026!";

function runSeed() {
  const serverRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
  const res = spawnSync(process.execPath, ["prisma/seed.js"], {
    cwd: serverRoot,
    stdio: "inherit",
    env: process.env,
  });
  if (res.status !== 0) {
    throw new Error(`Seed exited with code ${res.status}`);
  }
}

async function ensureManagerEmail() {
  const target = MANAGER_EMAIL.toLowerCase();
  const existingTarget = await prisma.user.findUnique({
    where: { email: target },
  });

  if (existingTarget?.roles?.includes("MANAGER")) {
    console.log(`Manager already exists: ${target}`);
    return;
  }

  if (existingTarget && !existingTarget.roles.includes("MANAGER")) {
    await prisma.user.update({
      where: { id: existingTarget.id },
      data: { roles: [...new Set([...existingTarget.roles, "MANAGER"])] },
    });
    console.log(`Added MANAGER role to existing user: ${target}`);
    return;
  }

  const managers = await prisma.user.findMany({
    where: { roles: { has: "MANAGER" } },
    orderBy: { createdAt: "asc" },
  });

  if (managers.length === 0) {
    const hash = await bcrypt.hash(NEW_MANAGER_PASSWORD, 10);
    await prisma.user.create({
      data: {
        email: target,
        password: hash,
        roles: ["USER", "MANAGER"],
        displayName: "Demo Manager",
      },
    });
    console.log(`Created manager ${target} (password: ${NEW_MANAGER_PASSWORD})`);
    return;
  }

  const primary = managers[0];
  const blocker = await prisma.user.findFirst({
    where: { email: target, NOT: { id: primary.id } },
  });
  if (blocker) {
    const fallback = `archived-${blocker.id.slice(0, 8)}@booking-lanka.local`;
    await prisma.user.update({
      where: { id: blocker.id },
      data: { email: fallback },
    });
    console.log(`Renamed conflicting account ${target} -> ${fallback}`);
  }

  const prev = primary.email;
  await prisma.user.update({
    where: { id: primary.id },
    data: { email: target },
  });
  console.log(`Primary manager email set: ${prev} -> ${target}`);
}

async function deleteScratchHotelsByName() {
  const nonSeed = await prisma.hotel.findMany({
    where: { NOT: { id: { startsWith: SEED_HOTEL_ID_PREFIX } } },
    select: { id: true, name: true },
  });

  const toRemove = nonSeed.filter((h) => isScratchHotelCandidate(h));

  if (toRemove.length === 0) {
    console.log("No matching scratch hotels to delete.");
    return;
  }

  const idSet = new Set(toRemove.map((h) => h.id));
  console.log(`Removing ${toRemove.length} scratch hotel(s):`);
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
  console.log(`Deleted ${idSet.size} hotel row(s).`);
}

async function main() {
  console.log("Step 1: Running prisma seed (10 demo hotels + destinations)…");
  runSeed();

  console.log("Step 2: Manager account…");
  await ensureManagerEmail();

  console.log("Step 3: Removing listed scratch hotels (non-seed only)…");
  await deleteScratchHotelsByName();

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
