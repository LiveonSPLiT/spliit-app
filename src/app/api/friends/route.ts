import { auth } from '@/lib/auth'
import {
  blockFriendDB,
  deleteRecentFriendDB,
  getRecentFriendsDB,
  getStarredFriendsDB,
  getblockedFriendsDB,
  saveRecentFriendDB,
  starFriendDB,
  unblockFriendDB,
  unstarFriendDB,
} from '@/lib/userFriendsHelper'
import { NextResponse } from 'next/server'

interface PostRequestBody {
  type: 'saveRecent' | 'star' | 'block'
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
      const recentGroups = await getRecentFriendsDB()
      return NextResponse.json(recentGroups)
    }

    if (type === 'starred') {
      const starredGroups = await getStarredFriendsDB()
      return NextResponse.json(starredGroups)
    }

    if (type === 'blocked') {
      const archivedGroups = await getblockedFriendsDB()
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
      await saveRecentFriendDB(group)
      return NextResponse.json({ message: 'Friend saved' })
    }

    if (type === 'star' && groupId) {
      await starFriendDB(groupId)
      return NextResponse.json({ message: 'Friend starred' })
    }

    if (type === 'block' && groupId) {
      await blockFriendDB(groupId)
      return NextResponse.json({ message: 'Friend blocked' })
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
      await deleteRecentFriendDB(groupId)
      return NextResponse.json({ message: 'Friend deleted' })
    }

    if (type === 'unstar' && groupId) {
      await unblockFriendDB(groupId)
      return NextResponse.json({ message: 'Friend unstarred' })
    }

    if (type === 'unblock' && groupId) {
      await unstarFriendDB(groupId)
      return NextResponse.json({ message: 'Friend unblocked' })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
})
