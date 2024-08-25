/*
  Warnings:

  - The `recurringDays` column on the `Expense` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RecurringTransactions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "recurringDays",
ADD COLUMN     "recurringDays" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "currency" SET DEFAULT '₹';

-- AlterTable
ALTER TABLE "RecurringTransactions" DROP CONSTRAINT "RecurringTransactions_pkey",
ALTER COLUMN "groupId" SET DATA TYPE TEXT,
ALTER COLUMN "expenseId" SET DATA TYPE TEXT,
ALTER COLUMN "lockId" SET DATA TYPE TEXT,
ADD CONSTRAINT "RecurringTransactions_pkey" PRIMARY KEY ("groupId", "expenseId");

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentGroup" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarredGroup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "StarredGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivedGroup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "ArchivedGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RecentGroup_userId_groupId_key" ON "RecentGroup"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "StarredGroup_userId_groupId_key" ON "StarredGroup"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "ArchivedGroup_userId_groupId_key" ON "ArchivedGroup"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "RecentGroup" ADD CONSTRAINT "RecentGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredGroup" ADD CONSTRAINT "StarredGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedGroup" ADD CONSTRAINT "ArchivedGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_recurring_transactions_group_expense_next_create" RENAME TO "RecurringTransactions_groupId_expenseId_createNextAt_idx";

-- RenameIndex
ALTER INDEX "idx_unq_recurring_transactions_lock_id" RENAME TO "RecurringTransactions_lockId_key";
