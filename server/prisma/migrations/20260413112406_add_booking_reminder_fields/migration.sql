-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "reminderAt" TIMESTAMP(3),
ADD COLUMN     "reminderMessage" TEXT,
ADD COLUMN     "reminderSeenAt" TIMESTAMP(3);
