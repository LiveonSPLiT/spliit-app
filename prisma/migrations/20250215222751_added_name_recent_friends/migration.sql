/*
  Warnings:

  - Added the required column `name` to the `RecentFriend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecentFriend" ADD COLUMN     "name" TEXT NOT NULL;
