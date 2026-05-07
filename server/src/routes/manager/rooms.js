import express from "express";
import { prisma } from "../../db/client.js";
import { authenticateManager } from "../../middleware/authManager.js";
import { upload } from "../../config/upload.js";
import { env } from "../../config/env.js";
import {
  sendBookingCancellationEmail,
  sendRoomAvailableEmail,
} from "../../services/emailService.js";

const router = express.Router();

function parseCsvOrArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value)
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function fileUrl(req, file) {
  return env.storageType === "s3"
    ? file.location
    : `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
}

/** Optional non-negative int from multipart body */
function parseOptionalPricePerPerson(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

async function assertHotelOwner(hotelId, managerId) {
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel || hotel.ownerUserId !== managerId) return null;
  return hotel;
}

async function assertRoomOwner(roomId, managerId) {
  const room = await prisma.roomType.findUnique({
    where: { id: roomId },
    include: { hotel: { select: { ownerUserId: true, id: true } } },
  });
  if (!room || room.hotel.ownerUserId !== managerId) return null;
  return room;
}

const roomInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  amenityImages: { orderBy: { sortOrder: "asc" } },
  bookingBlocks: { orderBy: { startDate: "asc" } },
};

function startOfLocalToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Paid / pending / in-stay bookings whose checkout is today or later block room edits. */
async function findActiveBookingBlock(roomTypeId) {
  return prisma.booking.findFirst({
    where: {
      roomTypeId,
      status: { in: ["PAID", "PENDING_PAYMENT", "CHECKED_IN"] },
      checkOut: { gte: startOfLocalToday() },
    },
    select: { id: true, checkIn: true, checkOut: true, status: true },
  });
}

async function respondIfRoomEditLocked(res, roomId) {
  const b = await findActiveBookingBlock(roomId);
  if (b) {
    res.status(403).json({
      error:
        "This room has an active guest booking. Editing is disabled until checkout has passed.",
      activeBooking: b,
    });
    return true;
  }
  return false;
}

/** One-shot create: gallery (≥1) + optional labeled amenity images + metadata */
router.post(
  "/complete/:hotelId",
  authenticateManager,
  upload.fields([
    { name: "galleryImages", maxCount: 20 },
    { name: "amenityImages", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const { hotelId } = req.params;
      const managerId = req.user.id;
      const hotel = await assertHotelOwner(hotelId, managerId);
      if (!hotel) {
        return res.status(403).json({ error: "You do not own this hotel" });
      }

      const {
        name,
        totalUnits,
        capacity,
        pricePerNight,
        pricePerPerson,
        overviewTitle,
        overview,
        viewpoint,
        description,
        highlights,
      } = req.body;

      const ppp = parseOptionalPricePerPerson(pricePerPerson);

      if (!name || !capacity || pricePerNight == null) {
        return res.status(400).json({ error: "Room name, total units, capacity, and price per night are required." });
      }

      let amenityLabels = [];
      try {
        amenityLabels = JSON.parse(req.body.amenityLabels || "[]");
      } catch {
        return res.status(400).json({ error: "Invalid amenityLabels JSON" });
      }
      if (!Array.isArray(amenityLabels)) {
        return res.status(400).json({ error: "amenityLabels must be an array" });
      }

      const gallery = req.files?.galleryImages || [];
      const amenityFiles = req.files?.amenityImages || [];

      if (gallery.length < 1) {
        return res.status(400).json({ error: "Add at least one room photo for the gallery carousel." });
      }
      if (amenityFiles.length > 0 && amenityLabels.length !== amenityFiles.length) {
        return res.status(400).json({
          error: "Each amenity image needs a matching label (same count as amenity images).",
        });
      }

      const parsedHighlights = parseCsvOrArray(highlights);
      const units = Number(totalUnits);
      const cap = Number(capacity);
      const price = Number(pricePerNight);
      if (!Number.isFinite(units) || units < 1) {
        return res.status(400).json({ error: "Total units must be at least 1." });
      }
      if (!Number.isFinite(cap) || cap < 1) {
        return res.status(400).json({ error: "Capacity must be at least 1." });
      }
      if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({ error: "Price per night must be greater than 0." });
      }

      const room = await prisma.$transaction(async (tx) => {
        const created = await tx.roomType.create({
          data: {
            hotelId,
            name: String(name).trim(),
            totalUnits: units,
            capacity: cap,
            pricePerNight: price,
            ...(ppp != null && { pricePerPerson: ppp }),
            ...(description != null && String(description).trim() && { description: String(description).trim() }),
            ...(overviewTitle != null && String(overviewTitle).trim() && { overviewTitle: String(overviewTitle).trim() }),
            ...(overview != null && String(overview).trim() && { overview: String(overview).trim() }),
            ...(viewpoint != null && String(viewpoint).trim() && { viewpoint: String(viewpoint).trim() }),
            ...(parsedHighlights.length > 0 && { highlights: parsedHighlights }),
          },
        });

        const imageRows = gallery.map((file, index) => ({
          roomTypeId: created.id,
          url: fileUrl(req, file),
          provider: env.storageType,
          key: file.key ?? file.filename,
          sortOrder: index,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          altText: `Room photo ${index + 1}`,
          isCover: index === 0,
        }));
        await tx.roomImage.createMany({ data: imageRows });

        if (amenityFiles.length > 0) {
          const amenityRows = amenityFiles.map((file, index) => ({
            roomTypeId: created.id,
            label: String(amenityLabels[index] || `Amenity ${index + 1}`).trim() || `Amenity ${index + 1}`,
            url: fileUrl(req, file),
            provider: env.storageType,
            key: file.key ?? file.filename,
            sortOrder: index,
            mimeType: file.mimetype,
            sizeBytes: file.size,
            altText: String(amenityLabels[index] || "").trim() || null,
          }));
          await tx.roomAmenityImage.createMany({ data: amenityRows });
        }

        return tx.roomType.findUnique({
          where: { id: created.id },
          include: roomInclude,
        });
      });

      res.status(201).json({ message: "Room created successfully", room });
    } catch (err) {
      console.error("Room complete create error:", err);
      res.status(500).json({ error: "Failed to create room" });
    }
  }
);

/** Replace gallery + amenity images and update metadata */
router.put(
  "/complete/:roomId",
  authenticateManager,
  upload.fields([
    { name: "galleryImages", maxCount: 20 },
    { name: "amenityImages", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const { roomId } = req.params;
      const managerId = req.user.id;
      const existing = await assertRoomOwner(roomId, managerId);
      if (!existing) {
        return res.status(403).json({ error: "Not authorized to update this room" });
      }
      if (await respondIfRoomEditLocked(res, roomId)) return;

      const {
        name,
        totalUnits,
        capacity,
        pricePerNight,
        pricePerPerson,
        overviewTitle,
        overview,
        viewpoint,
        description,
        highlights,
      } = req.body;

      const pppPut = parseOptionalPricePerPerson(pricePerPerson);

      let amenityLabels = [];
      try {
        amenityLabels = JSON.parse(req.body.amenityLabels || "[]");
      } catch {
        return res.status(400).json({ error: "Invalid amenityLabels JSON" });
      }
      if (!Array.isArray(amenityLabels)) {
        return res.status(400).json({ error: "amenityLabels must be an array" });
      }

      const gallery = req.files?.galleryImages;
      const hasNewGallery = Array.isArray(gallery) && gallery.length > 0;
      const amenityFiles = req.files?.amenityImages || [];
      const clearRoomAmenities = req.body.clearRoomAmenities === "1" || req.body.clearRoomAmenities === "true";

      if (amenityFiles.length > 0 && amenityLabels.length !== amenityFiles.length) {
        return res.status(400).json({
          error: "Each amenity image needs a matching label (same count as amenity images).",
        });
      }

      const parsedHighlights = parseCsvOrArray(highlights);
      const units = Number(totalUnits);
      const cap = Number(capacity);
      const price = Number(pricePerNight);
      if (!name || !Number.isFinite(units) || units < 1 || !Number.isFinite(cap) || cap < 1 || !Number.isFinite(price) || price <= 0) {
        return res.status(400).json({ error: "Valid name, total units, capacity, and price per night are required." });
      }

      const updated = await prisma.$transaction(async (tx) => {
        await tx.roomType.update({
          where: { id: roomId },
          data: {
            name: String(name).trim(),
            totalUnits: units,
            capacity: cap,
            pricePerNight: price,
            pricePerPerson: pppPut,
            description: description != null && String(description).trim() ? String(description).trim() : null,
            overviewTitle: overviewTitle != null && String(overviewTitle).trim() ? String(overviewTitle).trim() : null,
            overview: overview != null && String(overview).trim() ? String(overview).trim() : null,
            viewpoint: viewpoint != null && String(viewpoint).trim() ? String(viewpoint).trim() : null,
            highlights: parsedHighlights,
          },
        });

        if (hasNewGallery) {
          await tx.roomImage.deleteMany({ where: { roomTypeId: roomId } });
          const imageRows = gallery.map((file, index) => ({
            roomTypeId: roomId,
            url: fileUrl(req, file),
            provider: env.storageType,
            key: file.key ?? file.filename,
            sortOrder: index,
            mimeType: file.mimetype,
            sizeBytes: file.size,
            altText: `Room photo ${index + 1}`,
            isCover: index === 0,
          }));
          await tx.roomImage.createMany({ data: imageRows });
        }

        if (amenityFiles.length > 0) {
          await tx.roomAmenityImage.deleteMany({ where: { roomTypeId: roomId } });
          const amenityRows = amenityFiles.map((file, index) => ({
            roomTypeId: roomId,
            label: String(amenityLabels[index] || `Amenity ${index + 1}`).trim() || `Amenity ${index + 1}`,
            url: fileUrl(req, file),
            provider: env.storageType,
            key: file.key ?? file.filename,
            sortOrder: index,
            mimeType: file.mimetype,
            sizeBytes: file.size,
            altText: String(amenityLabels[index] || "").trim() || null,
          }));
          await tx.roomAmenityImage.createMany({ data: amenityRows });
        } else if (clearRoomAmenities) {
          await tx.roomAmenityImage.deleteMany({ where: { roomTypeId: roomId } });
        }

        return tx.roomType.findUnique({
          where: { id: roomId },
          include: roomInclude,
        });
      });

      res.json({ message: "Room updated successfully", room: updated });
    } catch (err) {
      console.error("Room complete update error:", err);
      res.status(500).json({ error: "Failed to update room" });
    }
  }
);

router.patch("/item/:roomId", authenticateManager, async (req, res) => {
  try {
    const { roomId } = req.params;
    const managerId = req.user.id;
    const existing = await assertRoomOwner(roomId, managerId);
    if (!existing) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (await respondIfRoomEditLocked(res, roomId)) return;

    const { name, totalUnits, capacity, pricePerNight, pricePerPerson, overviewTitle, overview, viewpoint, description, highlights } = req.body;
    const data = {};
    if (name != null) data.name = String(name).trim();
    if (totalUnits != null) {
      const u = Number(totalUnits);
      if (!Number.isFinite(u) || u < 1) return res.status(400).json({ error: "Invalid total units" });
      data.totalUnits = u;
    }
    if (capacity != null) {
      const c = Number(capacity);
      if (!Number.isFinite(c) || c < 1) return res.status(400).json({ error: "Invalid capacity" });
      data.capacity = c;
    }
    if (pricePerNight != null) {
      const p = Number(pricePerNight);
      if (!Number.isFinite(p) || p <= 0) return res.status(400).json({ error: "Invalid price" });
      data.pricePerNight = p;
    }
    if (pricePerPerson !== undefined) {
      data.pricePerPerson = parseOptionalPricePerPerson(pricePerPerson);
    }
    if (overviewTitle !== undefined) data.overviewTitle = overviewTitle ? String(overviewTitle).trim() : null;
    if (overview !== undefined) data.overview = overview ? String(overview).trim() : null;
    if (viewpoint !== undefined) data.viewpoint = viewpoint ? String(viewpoint).trim() : null;
    if (description !== undefined) data.description = description ? String(description).trim() : null;
    if (highlights !== undefined) data.highlights = parseCsvOrArray(highlights);

    const room = await prisma.roomType.update({
      where: { id: roomId },
      data,
      include: roomInclude,
    });
    res.json({ message: "Room updated", room });
  } catch (err) {
    console.error("Room patch error:", err);
    res.status(500).json({ error: "Failed to update room" });
  }
});

router.delete("/item/:roomId", authenticateManager, async (req, res) => {
  try {
    const { roomId } = req.params;
    const managerId = req.user.id;
    const existing = await assertRoomOwner(roomId, managerId);
    if (!existing) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (await respondIfRoomEditLocked(res, roomId)) return;
    await prisma.roomType.delete({ where: { id: roomId } });
    res.json({ message: "Room deleted" });
  } catch (err) {
    console.error("Room delete error:", err);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

// Legacy: create empty room (prefer POST /complete/:hotelId)
router.post("/", authenticateManager, async (req, res) => {
  try {
    const { hotelId, name, totalUnits, capacity, pricePerNight } = req.body;
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel || hotel.ownerUserId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this hotel" });
    }

    const room = await prisma.roomType.create({
      data: {
        hotelId,
        name,
        totalUnits: Number(totalUnits) || 1,
        capacity: Number(capacity),
        pricePerNight: Number(pricePerNight),
      },
    });

    res.json({ message: "Room created successfully", room });
  } catch (err) {
    console.error("Room create error:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

router.post(
  "/:id/images",
  authenticateManager,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const roomId = req.params.id;
      const managerId = req.user.id;

      const room = await prisma.roomType.findUnique({
        where: { id: roomId },
        include: { hotel: true },
      });

      if (!room || room.hotel.ownerUserId !== managerId) {
        return res.status(403).json({ error: "Not authorized to upload images for this room" });
      }
      if (await respondIfRoomEditLocked(res, roomId)) return;

      const roles = JSON.parse(req.body.roles || "[]");

      if (!req.files || req.files.length < 1) {
        return res.status(400).json({
          error: "At least one room image is required.",
        });
      }

      const imageData = req.files.map((file, index) => ({
        roomTypeId: room.id,
        url: fileUrl(req, file),
        provider: env.storageType,
        key: file.key ?? file.filename,
        sortOrder: index,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        altText: roles[index] || "Gallery",
        isCover: index === 0 || roles[index] === "Cover",
      }));

      await prisma.roomImage.createMany({ data: imageData });

      const updatedRoom = await prisma.roomType.findUnique({
        where: { id: roomId },
        include: roomInclude,
      });

      res.status(201).json({
        message: "Room images uploaded successfully",
        room: updatedRoom,
      });
    } catch (err) {
      console.error("Room image upload error:", err);
      res.status(500).json({ error: "Failed to upload room images" });
    }
  }
);

router.get("/item/:roomId", authenticateManager, async (req, res) => {
  try {
    const { roomId } = req.params;
    const managerId = req.user.id;
    const room = await prisma.roomType.findUnique({
      where: { id: roomId },
      include: {
        images: roomInclude.images,
        amenityImages: roomInclude.amenityImages,
        hotel: { select: { id: true, name: true, address: true, status: true, ownerUserId: true } },
      },
    });
    if (!room || room.hotel.ownerUserId !== managerId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const active = await findActiveBookingBlock(roomId);
    const { hotel, ...roomPayload } = room;
    res.json({
      room: roomPayload,
      hotel: { id: hotel.id, name: hotel.name, address: hotel.address, status: hotel.status },
      canEdit: !active,
      activeBooking: active,
    });
  } catch (err) {
    console.error("Get room item error:", err);
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

router.get("/:hotelId", authenticateManager, async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel || hotel.ownerUserId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this hotel" });
    }

    const rooms = await prisma.roomType.findMany({
      where: { hotelId },
      orderBy: { createdAt: "desc" },
      include: roomInclude,
    });

    const withFlags = await Promise.all(
      rooms.map(async (r) => ({
        ...r,
        canEdit: !(await findActiveBookingBlock(r.id)),
      }))
    );

    res.json(withFlags);
  } catch (err) {
    console.error("Get rooms error:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// Pause/blackout room booking for manual/offline reservations.
// Disallowed if PAID/CHECKED_IN/COMPLETED booking already overlaps.
router.post("/item/:roomId/blocks", authenticateManager, async (req, res) => {
  try {
    const { roomId } = req.params;
    const existing = await assertRoomOwner(roomId, req.user.id);
    if (!existing) return res.status(403).json({ error: "Not authorized" });

    const start = new Date(req.body?.startDate);
    const end = new Date(req.body?.endDate);
    const reason = req.body?.reason ? String(req.body.reason).trim() : null;
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ error: "Invalid blackout date range" });
    }

    const paidOverlap = await prisma.booking.findFirst({
      where: {
        roomTypeId: roomId,
        status: { in: ["PAID", "CHECKED_IN", "COMPLETED"] },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
      select: { id: true, checkIn: true, checkOut: true, status: true },
    });
    if (paidOverlap) {
      return res.status(409).json({
        error: "This date range cannot be paused because it is already booked and payment is made.",
        conflict: paidOverlap,
      });
    }

    const CANCEL_REASON = "Booking cancelled due to no space (manager paused room dates)"
    const cancellableBookings = await prisma.booking.findMany({
      where: {
        roomTypeId: roomId,
        status: { in: ["DRAFT", "PENDING_PAYMENT"] },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
      include: {
        user: { select: { email: true } },
        hotel: { select: { name: true } },
      },
    })

    const result = await prisma.$transaction(async (tx) => {
      const block = await tx.roomBookingBlock.create({
        data: { roomTypeId: roomId, startDate: start, endDate: end, reason },
      });

      // Manager pause overrides pending requests (not paid yet).
      const cancelled = await tx.booking.updateMany({
        where: {
          roomTypeId: roomId,
          status: { in: ["DRAFT", "PENDING_PAYMENT"] },
          checkIn: { lt: end },
          checkOut: { gt: start },
        },
        data: {
          status: "CANCELLED",
          cancelReason: CANCEL_REASON,
        },
      });

      return { block, cancelledCount: cancelled.count || 0 };
    });

    // Notify only affected request users. Email failures should not break API success.
    for (const b of cancellableBookings) {
      if (!b.user?.email) continue
      try {
        await sendBookingCancellationEmail(
          b.user.email,
          { id: b.id, hotel: b.hotel, checkIn: b.checkIn, checkOut: b.checkOut },
          CANCEL_REASON
        )
      } catch (e) {
        console.error("Booking cancellation notification failed:", e?.message || e)
      }
    }

    res.status(201).json({
      message: "Room booking paused for selected dates",
      block: result.block,
      cancelledCount: result.cancelledCount,
      cancelledReason: "Booking cancelled due to no space",
    });
  } catch (err) {
    console.error("Create room booking block error:", err);
    res.status(500).json({ error: "Failed to create room booking block" });
  }
});

router.delete("/item/:roomId/blocks/:blockId", authenticateManager, async (req, res) => {
  try {
    const { roomId, blockId } = req.params;
    const existing = await assertRoomOwner(roomId, req.user.id);
    if (!existing) return res.status(403).json({ error: "Not authorized" });

    const block = await prisma.roomBookingBlock.findUnique({ where: { id: blockId } });
    if (!block || block.roomTypeId !== roomId) {
      return res.status(404).json({ error: "Block not found" });
    }

    const affectedCancelled = await prisma.booking.findMany({
      where: {
        roomTypeId: roomId,
        status: "CANCELLED",
        cancelReason: { contains: "no space", mode: "insensitive" },
        checkIn: { lt: block.endDate },
        checkOut: { gt: block.startDate },
      },
      include: {
        user: { select: { email: true } },
        hotel: { select: { name: true } },
        roomType: { select: { name: true } },
      },
      take: 30,
      orderBy: { createdAt: "desc" },
    });

    await prisma.roomBookingBlock.delete({ where: { id: blockId } });

    for (const booking of affectedCancelled) {
      if (!booking.user?.email) continue;
      try {
        await sendRoomAvailableEmail(
          booking.user.email,
          booking.hotel?.name || "Booking Lanka",
          booking.roomType?.name || "Room",
          block.startDate,
          block.endDate
        );
      } catch (e) {
        console.error("Room available email failed:", e?.message || e);
      }
    }

    res.json({ message: "Booking pause removed" });
  } catch (err) {
    console.error("Delete room booking block error:", err);
    res.status(500).json({ error: "Failed to delete room booking block" });
  }
});

router.get("/item/:roomId/blocks", authenticateManager, async (req, res) => {
  try {
    const { roomId } = req.params;
    const existing = await assertRoomOwner(roomId, req.user.id);
    if (!existing) return res.status(403).json({ error: "Not authorized" });
    const blocks = await prisma.roomBookingBlock.findMany({
      where: { roomTypeId: roomId },
      orderBy: { startDate: "asc" },
    });
    res.json(blocks);
  } catch (err) {
    console.error("List room booking blocks error:", err);
    res.status(500).json({ error: "Failed to fetch booking pauses" });
  }
});

export default router;
