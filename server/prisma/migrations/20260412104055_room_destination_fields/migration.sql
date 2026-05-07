-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "overviewTitle" TEXT DEFAULT 'Room overview',
ADD COLUMN     "viewpoint" TEXT;

-- CreateTable
CREATE TABLE "RoomAmenityImage" (
    "id" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 's3',
    "key" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomAmenityImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomAmenityImage_roomTypeId_sortOrder_idx" ON "RoomAmenityImage"("roomTypeId", "sortOrder");

-- AddForeignKey
ALTER TABLE "RoomAmenityImage" ADD CONSTRAINT "RoomAmenityImage_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
