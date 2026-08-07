-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- Existing accounts can sign in without re-verifying
UPDATE "User" SET "emailVerified" = true WHERE "emailVerified" = false;
