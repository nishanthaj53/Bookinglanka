import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { PRICE_MAX } from "../utils/userDashboardHotelUtils";

export { PRICE_MAX };

/**
 * Build query string params for GET /hotels (user dashboard search).
 * When the price span covers the full range (0 … priceMaxCap), min/max are omitted.
 */
export function buildHotelListParams({
  city,
  keyword,
  propertyType,
  guests,
  priceMin,
  priceMax,
  priceMaxCap = PRICE_MAX,
}) {
  const params = new URLSearchParams();
  const district = (city || "").trim();
  if (district) params.set("city", district);
  const kw = (keyword || "").trim();
  if (kw) params.set("keyword", kw);
  const pt = (propertyType || "").trim();
  if (pt) params.set("propertyType", pt);
  if (guests >= 1) params.set("capacity", String(guests));

  const cap = priceMaxCap;
  const lo = Math.min(Number(priceMin) || 0, Number(priceMax) || cap);
  const hi = Math.max(Number(priceMin) || 0, Number(priceMax) || cap);
  const full = lo <= 0 && hi >= cap;
  if (!full) {
    params.set("minPrice", String(lo));
    params.set("maxPrice", String(hi));
  }
  return params;
}

/**
 * Fetches hotels when `inputs` fields change; debounced to avoid spamming the API while sliders move.
 */
export function useDebouncedHotelFetch(inputs, debounceMs = 280) {
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      setError("");
      try {
        const params = buildHotelListParams(inputs);
        const res = await apiClient.get(`/hotels?${params.toString()}`);
        if (cancelled) return;
        setAllHotels(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (cancelled) return;
        setError(e.response?.data?.error || e.message || "Failed to load hotels");
        setAllHotels([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, debounceMs);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [
    inputs.city,
    inputs.keyword,
    inputs.propertyType,
    inputs.guests,
    inputs.priceMin,
    inputs.priceMax,
    debounceMs,
  ]);

  return { allHotels, loading, error };
}
