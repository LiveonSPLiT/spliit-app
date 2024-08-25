import { auth } from '@/lib/auth'
import {
  archiveGroupDB,
  deleteRecentGroupDB,
  getArchivedGroupsDB,
  getRecentGroupsDB,
  getStarredGroupsDB,
  saveRecentGroupDB,
  starGroupDB,
  unarchiveGroupDB,
  unstarGroupDB,
} from '@/lib/userGroupsHelper'
import { NextResponse } from 'next/server'

interface PostRequestBody {
  type: 'saveRecent' | 'star' | 'archive'
  group?: {
    id: string
    name: string
  }
  groupId?: string
}

export const GET = auth(async function GET(request) {
  if (request.auth) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'recent') {
      const recentGroups = await getRecentGroupsDB()
      return NextResponse.json(recentGroups)
    }

    if (type === 'starred') {
      const starredGroups = await getStarredGroupsDB()
      return NextResponse.json(starredGroups)
    }

    if (type === 'archived') {
      const archivedGroups = await getArchivedGroupsDB()
      return NextResponse.json(archivedGroups)
    }

    return NextResponse.json(
      { error: 'Invalid query parameter' },
      { status: 400 },
    )
  }

  return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
})

export const POST = auth(async function POST(request) {
  if (request.auth) {
    const body = (await request.json()) as PostRequestBody

    const { type, group, groupId } = body

    if (type === 'saveRecent' && group) {
      await saveRecentGroupDB(group)
      return NextResponse.json({ message: 'Group saved' })
    }

    if (type === 'star' && groupId) {
      await starGroupDB(groupId)
      return NextResponse.json({ message: 'Group starred' })
    }

    if (type === 'archive' && groupId) {
      await archiveGroupDB(groupId)
      return NextResponse.json({ message: 'Group archived' })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
})

export const DELETE = auth(async function DELETE(request) {
  if (request.auth) {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const type = searchParams.get('type')

    if (type === 'deleteRecent' && groupId) {
      await deleteRecentGroupDB(groupId)
      return NextResponse.json({ message: 'Group deleted' })
    }

    if (type === 'unstar' && groupId) {
      await unstarGroupDB(groupId)
      return NextResponse.json({ message: 'Group unstarred' })
    }

    if (type === 'unarchive' && groupId) {
      await unarchiveGroupDB(groupId)
      return NextResponse.json({ message: 'Group unarchived' })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
})
