-- CreateTable
CREATE TABLE "HotelAmenityImage" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
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

    CONSTRAINT "HotelAmenityImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HotelAmenityImage_hotelId_sortOrder_idx" ON "HotelAmenityImage"("hotelId", "sortOrder");

-- AddForeignKey
ALTER TABLE "HotelAmenityImage" ADD CONSTRAINT "HotelAmenityImage_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
