-- CreateEnum
CREATE TYPE "NotificationPref" AS ENUM ('EMAIL', 'PUSH', 'BOTH');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notificationPref" "NotificationPref" NOT NULL DEFAULT 'BOTH',
ADD COLUMN     "pushSubscription" JSONB;
