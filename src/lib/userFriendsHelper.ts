import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const recentFriendsSchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string(),
  }),
)

export const starredFriendsSchema = z.array(z.string())
export const blockedFriendsSchema = z.array(z.string())

export type RecentFriends = z.infer<typeof recentFriendsSchema>
export type RecentFriend = RecentFriends[number]

async function getSessionEmail() {
  const session = await auth()
  return session?.user?.email
}

async function getUserIdByEmail(): Promise<string | null> {
  const email = (await getSessionEmail()) as string
  if (!email) return null
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
  return user ? user.id : null
}

export async function getRecentFriendsDB(): Promise<RecentFriends> {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  const recentFriends = await prisma.recentFriend.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
  })
  return recentFriends.map(({ groupId, name }) => ({ id: groupId, name }))
}

export async function saveRecentFriendDB(group: RecentFriend) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.recentFriend.upsert({
    where: { userId_groupId: { groupId: group.id, userId } },
    update: { name: group.name },
    create: { groupId: group.id, name: group.name, userId },
  })
}

export async function deleteRecentFriendDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.recentFriend.deleteMany({
    where: { groupId, userId },
  })
}

export async function getStarredFriendsDB(): Promise<
  z.infer<typeof starredFriendsSchema>
> {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  const starredFriends = await prisma.starredFriend.findMany({
    where: { userId },
  })
  return starredFriends.map(({ groupId }) => groupId)
}

export async function starFriendDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.starredFriend.create({
    data: { groupId, userId },
  })
}

export async function unstarFriendDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.starredFriend.deleteMany({
    where: { groupId, userId },
  })
}

export async function getblockedFriendsDB(): Promise<
  z.infer<typeof blockedFriendsSchema>
> {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  const blockedFriends = await prisma.blockedFriend.findMany({
    where: { userId },
  })
  return blockedFriends.map(({ groupId }) => groupId)
}

export async function blockFriendDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.blockedFriend.create({
    data: { groupId, userId },
  })
}

export async function unblockFriendDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.blockedFriend.deleteMany({
    where: { groupId, userId },
  })
}

export async function getEmailsByFriendId(
  groupId: string,
): Promise<{ email: string; name: string }[]> {
  if (!groupId) return []
  // Fetch all users associated with the given groupId from the RecentFriend model
  const users = await prisma.recentFriend.findMany({
    where: {
      groupId: groupId,
    },
    select: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  })

  // Map the result to return an array of emails
  return users.map((group) => ({
    email: group.user.email,
    name: group.user.name,
  }))
}

export async function getFriend(groupId: string) {

  const userId = (await getUserIdByEmail()) as string
  
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { participants: true },
  })

  if (!group) {
    return null;
  }

  // Set the name based on the alternate participant
  const alternateParticipant = group.participants.find((p) => p.userId !== userId);
  const user = await prisma.user.findUnique({
    where: { id: alternateParticipant?.userId || "Unknown" },
    select: { email: true },
  })
  return {
    ...group,
    name: alternateParticipant ? alternateParticipant.name : "Unknown",
    friendEmail: user?.email || "unknown@liveonsplit.com",
  };
}
