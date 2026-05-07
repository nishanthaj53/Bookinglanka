export const PRICE_MAX = 800;
export const PAGE_SIZE = 6;

export function stableStarRating(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 5) + 1;
}

export function stableRatingDecimal(id) {
  const base = stableStarRating(id);
  const frac = (Math.abs((id.charCodeAt(0) || 0) * 13 + id.length * 3) % 10) / 10;
  return Math.min(5, Math.max(1, Math.round((base - 0.35 + frac * 0.12) * 10) / 10));
}

export function stableReviewCount(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 19 + id.charCodeAt(i)) | 0;
  return 2 + (Math.abs(h) % 46);
}
