-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "totalUnits" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "RoomBookingBlock" (
    "id" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomBookingBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomBookingBlock_roomTypeId_startDate_endDate_idx" ON "RoomBookingBlock"("roomTypeId", "startDate", "endDate");

-- AddForeignKey
ALTER TABLE "RoomBookingBlock" ADD CONSTRAINT "RoomBookingBlock_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
