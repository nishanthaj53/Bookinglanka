-- Align Hotel and RoomType with schema.prisma (fields were added to schema without migration)

-- AlterTable
ALTER TABLE "public"."Hotel" ADD COLUMN     "description" TEXT,
ADD COLUMN     "overviewTitle" TEXT DEFAULT 'Hotel Overview',
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "checkInTime" TEXT,
ADD COLUMN     "checkOutTime" TEXT,
ADD COLUMN     "basePrice" INTEGER,
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "roomAmenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mapEmbedUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."RoomType" ADD COLUMN     "description" TEXT;
