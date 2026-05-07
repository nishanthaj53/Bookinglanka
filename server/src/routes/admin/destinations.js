import express from "express";
import { prisma } from "../../db/client.js";
import { authenticateAdmin } from "../../middleware/authAdmin.js";
import { upload } from "../../config/upload.js";

const router = express.Router();

function toSlug(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseJsonField(value, fallback) {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function parseBool(value, fallback = true) {
  if (value == null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
}

function getUploadedImageUrl(file) {
  if (!file) return null;
  if (file.location) return file.location;
  return `/uploads/${file.filename}`;
}

function normalizePayload(body, files = {}, current = {}) {
  const name = (body.name ?? current.name ?? "").trim();
  const slug = toSlug(body.slug || name || current.slug || "");
  const galleryImages = parseJsonField(body.galleryImages, current.galleryImages || []);
  const faqs = parseJsonField(body.faqs, current.faqs || []);
  const coverFile = files.coverImage?.[0];
  const cardFile = files.cardImage?.[0];
  const uploadedCover = getUploadedImageUrl(coverFile);
  const uploadedCard = getUploadedImageUrl(cardFile);
  const bodyCover = String(body.coverImageUrl ?? "").trim();
  const bodyCard = String(body.cardImageUrl ?? "").trim();

  return {
    name,
    slug,
    district: (body.district ?? current.district ?? "").trim() || null,
    town: (body.town ?? current.town ?? "").trim() || null,
    region: (body.region ?? current.region ?? "").trim() || null,
    bestFor: (body.bestFor ?? current.bestFor ?? "").trim() || null,
    overview: (body.overview ?? current.overview ?? "").trim() || null,
    whyVisit: (body.whyVisit ?? current.whyVisit ?? "").trim() || null,
    mapEmbedUrl: (body.mapEmbedUrl ?? current.mapEmbedUrl ?? "").trim() || null,
    coverImageUrl: uploadedCover || bodyCover || current.coverImageUrl || null,
    cardImageUrl: uploadedCard || bodyCard || current.cardImageUrl || null,
    galleryImages: Array.isArray(galleryImages) ? galleryImages.filter(Boolean) : [],
    faqs,
    isActive: parseBool(body.isActive, current.isActive ?? true),
    sortOrder: Number.isFinite(Number(body.sortOrder))
      ? Number(body.sortOrder)
      : Number(current.sortOrder || 0),
  };
}

const destinationImageUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "cardImage", maxCount: 1 },
]);

router.get("/", authenticateAdmin, async (_req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json(destinations);
  } catch (err) {
    console.error("Admin destination list error:", err);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

router.post("/", authenticateAdmin, destinationImageUpload, async (req, res) => {
  try {
    const payload = normalizePayload(req.body, req.files || {}, {});
    if (!payload.name || !payload.slug) {
      return res.status(400).json({ error: "name is required" });
    }

    const destination = await prisma.destination.create({ data: payload });
    res.status(201).json(destination);
  } catch (err) {
    console.error("Admin destination create error:", err);
    res.status(500).json({ error: "Failed to create destination" });
  }
});

router.put("/:id", authenticateAdmin, destinationImageUpload, async (req, res) => {
  try {
    const current = await prisma.destination.findUnique({ where: { id: req.params.id } });
    if (!current) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const payload = normalizePayload(req.body, req.files || {}, current);
    if (!payload.name || !payload.slug) {
      return res.status(400).json({ error: "name is required" });
    }

    const destination = await prisma.destination.update({
      where: { id: req.params.id },
      data: payload,
    });
    res.json(destination);
  } catch (err) {
    console.error("Admin destination update error:", err);
    res.status(500).json({ error: "Failed to update destination" });
  }
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    await prisma.destination.delete({ where: { id: req.params.id } });
    res.json({ message: "Destination deleted" });
  } catch (err) {
    console.error("Admin destination delete error:", err);
    res.status(500).json({ error: "Failed to delete destination" });
  }
});

export default router;
