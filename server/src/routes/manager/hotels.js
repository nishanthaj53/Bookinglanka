import express from "express";
import { prisma } from "../../db/client.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";
import { upload } from "../../config/upload.js";
import { env } from "../../config/env.js";
import fs from "fs";
import path from "path";

const router = express.Router();

function parseCsvOrArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildMapEmbedFromAddress(address) {
  if (!address) return null;
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=14&output=embed`;
}

function parseOptionalFloat(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

// ✅ Create hotel (manager only) + ordered image upload
// ✅ Create hotel (with labeled image upload)
router.post(
  "/",
  authenticateUser,
  authorizeRoles("MANAGER"),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "amenityImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        address,
        latitude,
        longitude,
        description,
        facilities,
        overviewTitle,
        overview,
        propertyType,
        checkInTime,
        checkOutTime,
        basePrice,
        mapEmbedUrl,
        highlights,
        amenities,
        roomAmenities,
      } = req.body;
      if (!name || !address) {
        return res.status(400).json({ error: "Hotel name and address are required" });
      }

      let roles;
      try {
        roles = JSON.parse(req.body.roles || "[]");
      } catch {
        return res.status(400).json({ error: "Invalid image roles data" });
      }
      if (!Array.isArray(roles)) {
        return res.status(400).json({ error: "Image roles must be an array" });
      }
      const parsedHighlights = parseCsvOrArray(highlights);
      const parsedFacilities = parseCsvOrArray(facilities);
      const mergedHighlights = Array.from(new Set([...parsedHighlights, ...parsedFacilities]));
      const parsedAmenities = parseCsvOrArray(amenities);
      const parsedRoomAmenities = parseCsvOrArray(roomAmenities);
      const finalMapEmbedUrl = mapEmbedUrl || buildMapEmbedFromAddress(address);

      const uploadedHotelImages = req.files?.images || [];
      const uploadedAmenityImages = req.files?.amenityImages || [];

      // Cover + at least one additional gallery image (matches public hotel detail UX).
      if (uploadedHotelImages.length < 2) {
        return res.status(400).json({
          error: "A cover image and at least one additional relevant hotel photo are required.",
        });
      }
      if (roles.length !== uploadedHotelImages.length) {
        return res.status(400).json({ error: "Each hotel image must have a role entry" });
      }
      if (roles[0] !== "Cover") {
        return res.status(400).json({ error: "The first image must be the cover image." });
      }
      if (roles.filter((r) => r === "Cover").length !== 1) {
        return res.status(400).json({ error: "Exactly one image must be marked as Cover." });
      }

      // ✅ create hotel record
      const hotel = await prisma.hotel.create({
        data: {
          name,
          address,
          latitude: parseOptionalFloat(latitude),
          longitude: parseOptionalFloat(longitude),
          ownerUserId: req.user.id,
          status: "DRAFT",
          ...(description && { description }),
          ...(overviewTitle && { overviewTitle }),
          ...(overview && { overview }),
          ...(propertyType && { propertyType }),
          ...(checkInTime && { checkInTime }),
          ...(checkOutTime && { checkOutTime }),
          ...(basePrice && { basePrice: Number(basePrice) || null }),
          ...(finalMapEmbedUrl && { mapEmbedUrl: finalMapEmbedUrl }),
          ...(mergedHighlights.length > 0 && { highlights: mergedHighlights }),
          ...(parsedAmenities.length > 0 && { amenities: parsedAmenities }),
          ...(parsedRoomAmenities.length > 0 && { roomAmenities: parsedRoomAmenities }),
        },
      });

      // ✅ Map uploaded files with selected roles
      const imageData = uploadedHotelImages.map((file, index) => ({
        hotelId: hotel.id,
        url:
          env.storageType === "s3"
            ? file.location
            : `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        provider: env.storageType,
        key: file.key ?? file.filename,
        sortOrder: index,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        altText: roles[index] || "Other",
        isCover: roles[index] === "Cover",
      }));

      await prisma.hotelImage.createMany({ data: imageData });

      if (uploadedAmenityImages.length > 0) {
        const amenityImageData = uploadedAmenityImages.map((file, index) => ({
          hotelId: hotel.id,
          url:
            env.storageType === "s3"
              ? file.location
              : `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
          provider: env.storageType,
          key: file.key ?? file.filename,
          sortOrder: index,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          altText: `Amenity ${index + 1}`,
        }));
        await prisma.hotelAmenityImage.createMany({ data: amenityImageData });
      }

      const createdHotel = await prisma.hotel.findUnique({
        where: { id: hotel.id },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          amenityImages: { orderBy: { sortOrder: "asc" } },
        },
      });

      res.status(201).json({
        message: "Hotel created successfully with labeled images",
        hotel: createdHotel,
      });
    } catch (err) {
      console.error("Create hotel error:", err);
      const hint = err?.message || String(err);
      const isDev = (env.nodeEnv || process.env.NODE_ENV) !== "production";
      res.status(500).json({
        error: "Failed to create hotel",
        ...(isDev && { details: hint }),
      });
    }
  }
);

router.put(
  "/:id/images",
  authenticateUser,
  authorizeRoles("MANAGER"),
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { id } = req.params;
      const roles = JSON.parse(req.body.roles || "[]");

      const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: { images: true },
      });
      if (!hotel || hotel.ownerUserId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const files = req.files || [];
      if (files.length === 0) {
        return res.status(400).json({ error: "Please upload at least one image" });
      }

      // Remove old images if needed
      await prisma.hotelImage.deleteMany({ where: { hotelId: id } });

      const newImages = files.map((file, index) => ({
        hotelId: id,
        url:
          env.storageType === "s3"
            ? file.location
            : `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        provider: env.storageType,
        key: file.key ?? file.filename,
        sortOrder: index,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        altText: roles[index] || "Other",
        isCover: roles[index] === "Cover",
      }));

      const coverCount = newImages.filter((row) => row.isCover).length;
      if (coverCount === 0) {
        newImages[0].isCover = true;
        newImages[0].altText = "Cover";
      } else if (coverCount > 1) {
        let kept = false;
        for (const row of newImages) {
          if (row.isCover) {
            if (kept) row.isCover = false;
            else kept = true;
          }
        }
      }

      await prisma.hotelImage.createMany({ data: newImages });

      const updatedHotel = await prisma.hotel.findUnique({
        where: { id },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });

      res.json({ message: "Hotel images updated successfully", hotel: updatedHotel });
    } catch (err) {
      console.error("Update hotel images error:", err);
      res.status(500).json({ error: "Failed to update hotel images" });
    }
  }
);

router.put(
  "/:id/amenity-images",
  authenticateUser,
  authorizeRoles("MANAGER"),
  upload.array("amenityImages", 10),
  async (req, res) => {
    try {
      const { id } = req.params;
      const hotel = await prisma.hotel.findUnique({ where: { id } });
      if (!hotel || hotel.ownerUserId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const files = req.files || [];
      if (files.length === 0) {
        return res.status(400).json({ error: "Please upload at least one amenity image" });
      }

      await prisma.hotelAmenityImage.deleteMany({ where: { hotelId: id } });
      const amenityImageData = files.map((file, index) => ({
        hotelId: id,
        url:
          env.storageType === "s3"
            ? file.location
            : `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        provider: env.storageType,
        key: file.key ?? file.filename,
        sortOrder: index,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        altText: `Amenity ${index + 1}`,
      }));
      await prisma.hotelAmenityImage.createMany({ data: amenityImageData });

      const updatedHotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          amenityImages: { orderBy: { sortOrder: "asc" } },
        },
      });
      res.json({ message: "Amenity images updated successfully", hotel: updatedHotel });
    } catch (err) {
      console.error("Update amenity images error:", err);
      res.status(500).json({ error: "Failed to update amenity images" });
    }
  }
);

// ✅ List hotels (unchanged except include ordered images)
router.get("/", authenticateUser, authorizeRoles("MANAGER"), async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      where: { ownerUserId: req.user.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } }, // ✅ Include images
        amenityImages: { orderBy: { sortOrder: "asc" } },
        rooms: {
          select: { id: true, name: true, capacity: true, pricePerNight: true, createdAt: true },
        },
        bookings: {
          select: { id: true, status: true, checkIn: true, checkOut: true, totalAmount: true },
        },
      },
    });
    res.json(hotels);
  } catch (err) {
    console.error("List hotels error:", err);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

/** Single hotel for manager edit screen */
router.get("/:id", authenticateUser, authorizeRoles("MANAGER"), async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await prisma.hotel.findFirst({
      where: { id, ownerUserId: req.user.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenityImages: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  } catch (err) {
    console.error("Get hotel error:", err);
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

/** Update hotel text / metadata (images use PUT …/images and …/amenity-images) */
router.patch("/:id", authenticateUser, authorizeRoles("MANAGER"), async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await prisma.hotel.findFirst({
      where: { id, ownerUserId: req.user.id },
    });
    if (!hotel) {
      return res.status(403).json({ error: "Hotel not found or unauthorized" });
    }

    const {
      name,
      address,
      latitude,
      longitude,
      description,
      overviewTitle,
      overview,
      propertyType,
      checkInTime,
      checkOutTime,
      basePrice,
      mapEmbedUrl,
      highlights,
      amenities,
      roomAmenities,
      facilities,
    } = req.body;

    const parsedAmenities = amenities !== undefined ? parseCsvOrArray(amenities) : null;
    const parsedRoomAmenities = roomAmenities !== undefined ? parseCsvOrArray(roomAmenities) : null;

    const data = {};
    if (name !== undefined) data.name = String(name).trim() || hotel.name;
    if (address !== undefined) data.address = String(address).trim() || null;
    if (latitude !== undefined) data.latitude = parseOptionalFloat(latitude);
    if (longitude !== undefined) data.longitude = parseOptionalFloat(longitude);
    if (description !== undefined) data.description = description === "" ? null : String(description);
    if (overviewTitle !== undefined) data.overviewTitle = overviewTitle === "" ? null : String(overviewTitle);
    if (overview !== undefined) data.overview = overview === "" ? null : String(overview);
    if (propertyType !== undefined) data.propertyType = propertyType === "" ? null : String(propertyType);
    if (checkInTime !== undefined) data.checkInTime = checkInTime === "" ? null : String(checkInTime);
    if (checkOutTime !== undefined) data.checkOutTime = checkOutTime === "" ? null : String(checkOutTime);
    if (basePrice !== undefined) {
      if (basePrice === "" || basePrice === null) data.basePrice = null;
      else {
        const n = Number(basePrice);
        data.basePrice = Number.isFinite(n) ? Math.round(n) : null;
      }
    }
    if (mapEmbedUrl !== undefined) data.mapEmbedUrl = mapEmbedUrl === "" ? null : String(mapEmbedUrl);

    if (highlights !== undefined || facilities !== undefined) {
      const h = highlights !== undefined ? parseCsvOrArray(highlights) : [...(hotel.highlights || [])];
      const f = facilities !== undefined ? parseCsvOrArray(facilities) : [];
      data.highlights = Array.from(new Set([...h, ...f]));
    }
    if (parsedAmenities != null) data.amenities = parsedAmenities;
    if (parsedRoomAmenities != null) data.roomAmenities = parsedRoomAmenities;

    await prisma.hotel.update({
      where: { id },
      data,
    });

    const updated = await prisma.hotel.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenityImages: { orderBy: { sortOrder: "asc" } },
      },
    });
    res.json({ message: "Hotel updated", hotel: updated });
  } catch (err) {
    console.error("Patch hotel error:", err);
    res.status(500).json({ error: "Failed to update hotel" });
  }
});

/** Delete hotel owned by this manager (cascades rooms, images, bookings, etc.) */
router.delete("/:id", authenticateUser, authorizeRoles("MANAGER"), async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await prisma.hotel.findFirst({
      where: { id, ownerUserId: req.user.id },
    });
    if (!hotel) {
      return res.status(403).json({ error: "Hotel not found or unauthorized" });
    }

    const activeBookings = await prisma.booking.count({
      where: {
        hotelId: id,
        status: { not: "CANCELLED" },
      },
    });
    if (activeBookings > 0) {
      return res.status(409).json({
        error:
          "Cannot delete this hotel while it has bookings that are not cancelled — including a guest request (draft), an accepted booking awaiting payment, or a confirmed / in-progress / completed stay. Cancel or resolve those bookings first.",
      });
    }

    await prisma.$transaction(async (tx) => {
      const usersWithHotel = await tx.user.findMany({
        where: { hotelIds: { has: id } },
        select: { id: true, hotelIds: true },
      });
      for (const u of usersWithHotel) {
        await tx.user.update({
          where: { id: u.id },
          data: { hotelIds: u.hotelIds.filter((hid) => hid !== id) },
        });
      }
      await tx.hotel.delete({ where: { id } });
    });

    res.json({ message: "Hotel deleted" });
  } catch (err) {
    console.error("Delete hotel error:", err);
    res.status(500).json({ error: "Failed to delete hotel" });
  }
});

export default router;
