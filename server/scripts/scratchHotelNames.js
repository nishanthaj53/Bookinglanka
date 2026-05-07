/** Never delete prisma/seed.js demo hotels. */
export const SEED_HOTEL_ID_PREFIX = "f1b9ab1a-0d01-4f24-a001-";

/** Names to remove (demo scratch hotels). Match after normalizeHotelName(). */
export const SCRATCH_HOTEL_NAME_LIST = [
  "new hotel in colombo",
  "test hotel",
  "balangoda 3 star hotel",
  "ratnapura hotel",
  "testing hotel",
  "banarawela ocean view resort spa",
  "bandarawela ocean view resort spa",
  "cinnamon grand",
  "galadari",
  "cinnamon grand hotel",
  "galadari hotel",
];

export function normalizeHotelName(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function scratchNameSet() {
  return new Set(SCRATCH_HOTEL_NAME_LIST.map(normalizeHotelName));
}

/**
 * True if this row should be removed as a user-created scratch hotel.
 * Uses exact normalized title plus safe phrase checks (seed IDs excluded).
 */
export function isScratchHotelCandidate({ id, name }) {
  if (!id || id.startsWith(SEED_HOTEL_ID_PREFIX)) return false;
  if (scratchNameSet().has(normalizeHotelName(name))) return true;

  const raw = String(name || "");
  const low = raw.toLowerCase();

  if (low.includes("galadari")) return true;
  if (low.includes("cinnamon") && low.includes("grand")) return true;
  if (low.includes("new hotel") && low.includes("colombo")) return true;
  if (/\btest\s+hotel\b/i.test(raw)) return true;
  if (/\btesting\s+hotel\b/i.test(raw)) return true;
  if (low.includes("balangoda") && low.includes("star")) return true;
  if (low.includes("ratnapura") && low.includes("hotel")) return true;
  if (
    (low.includes("banarawela") || low.includes("bandarawela")) &&
    low.includes("ocean") &&
    low.includes("view")
  ) {
    return true;
  }

  return false;
}
