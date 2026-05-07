import express from "express";
import { authenticateManager } from "../../middleware/authManager.js";

const router = express.Router();

/**
 * Proxy search for manager UI (avoids browser CORS / Nominatim policy issues).
 * GET /manager/geocode?q=Colombo
 */
router.get("/", authenticateManager, async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (q.length < 2) {
    return res.status(400).json({ error: "Enter at least 2 characters to search." });
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("q", q);
    url.searchParams.set("limit", "10");
    url.searchParams.set("addressdetails", "1");

    const upstream = await fetch(url.toString(), {
      headers: {
        "User-Agent": "BookingLanka-Manager/1.0 (contact: booking-lanka-demo)",
        Accept: "application/json",
      },
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: "Location search is temporarily unavailable." });
    }

    const data = await upstream.json();
    const raw = Array.isArray(data) ? data : [];
    const results = raw.map((item) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));

    res.json({ results });
  } catch (err) {
    console.error("Geocode error:", err);
    res.status(500).json({ error: "Location search failed." });
  }
});

export default router;
