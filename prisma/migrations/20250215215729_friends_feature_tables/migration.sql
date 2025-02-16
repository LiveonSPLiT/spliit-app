-- CreateTable
CREATE TABLE "RecentFriend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "RecentFriend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarredFriend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "StarredFriend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedFriend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "BlockedFriend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecentFriend_userId_groupId_key" ON "RecentFriend"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "StarredFriend_userId_groupId_key" ON "StarredFriend"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedFriend_userId_groupId_key" ON "BlockedFriend"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "RecentFriend" ADD CONSTRAINT "RecentFriend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredFriend" ADD CONSTRAINT "StarredFriend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedFriend" ADD CONSTRAINT "BlockedFriend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
