-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('MULTI_MEMBER', 'DUAL_MEMBER');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "type" "GroupType" NOT NULL DEFAULT 'MULTI_MEMBER';

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
