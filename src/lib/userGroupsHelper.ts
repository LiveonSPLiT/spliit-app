import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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
    const session = await auth();
    return session?.user?.email;
  }
  
async function getUserIdByEmail(): Promise<string | null> {
    const email = await getSessionEmail() as string
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })
    return user ? user.id : null
}

  export async function getRecentGroups(): Promise<RecentGroups> {
    const userId = await getUserIdByEmail() as string
    const recentGroups = await prisma.recentGroup.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    })
    return recentGroups.map(({ groupId, name }) => ({ id: groupId, name }))
  }
  
  export async function saveRecentGroup(group: RecentGroup) {
    const userId = await getUserIdByEmail() as string
    await prisma.recentGroup.upsert({
      where: { userId_groupId: { groupId: group.id, userId } },
      update: { name: group.name },
      create: { groupId: group.id, name: group.name, userId },
    })
  }
  
  export async function deleteRecentGroup(groupId: string) {
    const userId = await getUserIdByEmail() as string
    await prisma.recentGroup.deleteMany({
      where: { groupId, userId },
    })
  }
  
  export async function getStarredGroups(): Promise<z.infer<typeof starredGroupsSchema>> {
    const userId = await getUserIdByEmail() as string
    const starredGroups = await prisma.starredGroup.findMany({
      where: { userId },
    })
    return starredGroups.map(({ groupId }) => groupId)
  }
  
  export async function starGroup(groupId: string) {
    const userId = await getUserIdByEmail() as string
    await prisma.starredGroup.create({
      data: { groupId, userId },
    })
  }
  
  export async function unstarGroup(groupId: string) {
    const userId = await getUserIdByEmail() as string
    await prisma.starredGroup.deleteMany({
      where: { groupId, userId },
    })
  }
  
  export async function getArchivedGroups(): Promise<z.infer<typeof archivedGroupsSchema>> {
    const userId = await getUserIdByEmail() as string
    const archivedGroups = await prisma.archivedGroup.findMany({
      where: { userId },
    })
    return archivedGroups.map(({ groupId }) => groupId)
  }
  
  export async function archiveGroup(groupId: string) {
    const userId = await getUserIdByEmail() as string
    await prisma.archivedGroup.create({
      data: { groupId, userId },
    })
  }
  
  export async function unarchiveGroup(groupId: string) {
    const userId = await getUserIdByEmail() as string
    await prisma.archivedGroup.deleteMany({
      where: { groupId, userId },
    })
  }