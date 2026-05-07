/**
 * Inline data URL for "No Image" placeholder.
 * Use this in img onError to avoid 404 retry loops (e.g. default-hotel.jpg missing).
 * No network request = no repeated failures or 429 from rate limiting.
 */
export const HOTEL_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='180' viewBox='0 0 280 180'%3E%3Crect fill='%23eee' width='280' height='180'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * Use in onError: prevents infinite retry by switching to placeholder once.
 */
export function setImagePlaceholderOnError(e) {
  const el = e?.target;
  if (!el || el.dataset.fallback === "1") return;
  el.dataset.fallback = "1";
  el.src = HOTEL_IMAGE_PLACEHOLDER;
}
