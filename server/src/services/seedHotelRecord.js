import { SEED_DEFAULT_ROOM_TEMPLATES } from "../data/seedHotelsCatalog.js";

function mapEmbed(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  return `https://maps.google.com/maps?q=${la},${ln}&z=15&output=embed`;
}

function roomsFor(hotel, indexOffset) {
  if (Array.isArray(hotel.rooms) && hotel.rooms.length) return hotel.rooms;
  return SEED_DEFAULT_ROOM_TEMPLATES.map((room) => ({
    ...room,
    pricePerNight: room.pricePerNight + indexOffset * 3,
  }));
}

export async function upsertSeedHotel(prisma, hotel, indexOffset = 0) {
  const rooms = roomsFor(hotel, indexOffset);
  const highlights = hotel.highlights || ["Free Wi-Fi", "On-site dining", "24-hour reception"];
  const amenities = hotel.amenities || [
    "Outdoor pool",
    "Fitness centre",
    "Spa services",
    "Airport shuttle",
    "Concierge",
  ];
  const roomAmenities = hotel.roomAmenities || [
    "Air conditioning",
    "Smart TV",
    "Tea & coffee",
    "In-room safe",
    "Daily housekeeping",
  ];

  await prisma.hotel.upsert({
    where: { id: hotel.id },
    update: {
      name: hotel.name,
      address: hotel.address,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      status: "ACTIVE",
      propertyType: hotel.propertyType || undefined,
      overview: hotel.overview || undefined,
      description: hotel.overview || undefined,
      highlights,
      amenities,
      roomAmenities,
      mapEmbedUrl: mapEmbed(hotel.latitude, hotel.longitude),
      checkInTime: hotel.checkInTime || "2:00 PM",
      checkOutTime: hotel.checkOutTime || "11:00 AM",
      basePrice: rooms[0]?.pricePerNight,
    },
    create: {
      id: hotel.id,
      name: hotel.name,
      address: hotel.address,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      status: "ACTIVE",
      propertyType: hotel.propertyType || "Hotel",
      overview: hotel.overview || `Stay at ${hotel.name}.`,
      description: hotel.overview || `Stay at ${hotel.name}.`,
      highlights,
      amenities,
      roomAmenities,
      mapEmbedUrl: mapEmbed(hotel.latitude, hotel.longitude),
      checkInTime: "2:00 PM",
      checkOutTime: "11:00 AM",
      basePrice: rooms[0]?.pricePerNight,
    },
  });

  await prisma.hotelImage.deleteMany({ where: { hotelId: hotel.id } });
  await prisma.roomType.deleteMany({ where: { hotelId: hotel.id } });

  await prisma.hotelImage.createMany({
    data: hotel.images.map((url, idx) => ({
      hotelId: hotel.id,
      url,
      isCover: idx === 0,
      sortOrder: idx,
      provider: "url",
      altText: `${hotel.name} image ${idx + 1}`,
    })),
  });

  for (let i = 0; i < rooms.length; i += 1) {
    const room = rooms[i];
    await prisma.roomType.create({
      data: {
        id: `f71ce6a1-ae9e-47f8-af69-${String(indexOffset + 1).padStart(3, "0")}${String(i + 1).padStart(3, "0")}`,
        hotelId: hotel.id,
        name: room.name,
        description: room.description,
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        totalUnits: 3,
        images: {
          create: (room.images || []).map((url, imgIdx) => ({
            url,
            isCover: imgIdx === 0,
            sortOrder: imgIdx,
            provider: "url",
            altText: `${room.name} image ${imgIdx + 1}`,
          })),
        },
      },
    });
  }
}
