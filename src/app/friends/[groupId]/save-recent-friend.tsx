'use client'
import { saveRecentFriend } from '@/app/friends/recent-friends-helpers'
import { useEffect } from 'react'
import { useCurrentGroup } from './current-friend-context'

export function SaveFriendLocally() {
  const { group } = useCurrentGroup()

  useEffect(() => {
    if (group) saveRecentFriend({ id: group.id, name: group.name })
  }, [group])

  return null
}
