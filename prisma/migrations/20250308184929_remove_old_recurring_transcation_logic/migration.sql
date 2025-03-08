/*
  Warnings:

  - You are about to drop the column `recurringDays` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `RecurringTransactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "recurringDays";

-- DropTable
DROP TABLE "RecurringTransactions";
