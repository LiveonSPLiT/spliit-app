'use client'
import { saveRecentGroup } from '@/app/friends/recent-friends-helpers'
import { useEffect } from 'react'
import { useCurrentGroup } from './current-friend-context'

export function SaveGroupLocally() {
  const { group } = useCurrentGroup()

  useEffect(() => {
    if (group) saveRecentGroup({ id: group.id, name: group.name })
  }, [group])

  return null
}
