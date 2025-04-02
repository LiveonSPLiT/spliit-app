import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const recentGroupsSchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string(),
  }),
)

export const starredGroupsSchema = z.array(z.string())
export const archivedGroupsSchema = z.array(z.string())

export type RecentGroups = z.infer<typeof recentGroupsSchema>
export type RecentGroup = RecentGroups[number]

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

export async function getRecentGroupsDB(): Promise<RecentGroups> {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  const recentGroups = await prisma.recentGroup.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
  })
  return recentGroups.map(({ groupId, name }) => ({ id: groupId, name }))
}

export async function saveRecentGroupDB(group: RecentGroup) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.recentGroup.upsert({
    where: { userId_groupId: { groupId: group.id, userId } },
    update: { name: group.name },
    create: { groupId: group.id, name: group.name, userId },
  })
}

export async function deleteRecentGroupDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.recentGroup.deleteMany({
    where: { groupId, userId },
  })
}

export async function getStarredGroupsDB(): Promise<
  z.infer<typeof starredGroupsSchema>
> {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  const starredGroups = await prisma.starredGroup.findMany({
    where: { userId },
  })
  return starredGroups.map(({ groupId }) => groupId)
}

export async function starGroupDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.starredGroup.create({
    data: { groupId, userId },
  })
}

export async function unstarGroupDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.starredGroup.deleteMany({
    where: { groupId, userId },
  })
}

export async function getArchivedGroupsDB(): Promise<
  z.infer<typeof archivedGroupsSchema>
> {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  const archivedGroups = await prisma.archivedGroup.findMany({
    where: { userId },
  })
  return archivedGroups.map(({ groupId }) => groupId)
}

export async function archiveGroupDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.archivedGroup.create({
    data: { groupId, userId },
  })
}

export async function unarchiveGroupDB(groupId: string) {
  const userId = (await getUserIdByEmail()) as string
  if (!userId) return []
  await prisma.archivedGroup.deleteMany({
    where: { groupId, userId },
  })
}

export async function getEmailsByGroupId(
  groupId: string,
): Promise<
  {
    email: string
    name: string
    pushSubscription: Prisma.JsonValue
    notificationPref: string
  }[]
> {
  if (!groupId) return []
  // Fetch all users associated with the given groupId from the RecentGroup model
  const users = await prisma.recentGroup.findMany({
    where: {
      groupId: groupId,
    },
    select: {
      user: {
        select: {
          email: true,
          name: true,
          pushSubscription: true,
          notificationPref: true,
        },
      },
    },
  })

  // Map the result to return an array of emails
  return users.map((group) => ({
    email: group.user.email,
    name: group.user.name,
    pushSubscription: group.user.pushSubscription,
    notificationPref: group.user.notificationPref,
  }))
}

export async function getGroup(groupId: string) {
  return prisma.group.findUnique({
    where: { id: groupId },
    include: { participants: true },
  })
}
