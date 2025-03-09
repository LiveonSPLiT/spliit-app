'use client'

import { FriendForm } from '@/components/friend-form'
import { trpc } from '@/trpc/client'
import { useSession } from 'next-auth/react'
import { useCurrentGroup } from '../current-friend-context'

export const EditFriend = () => {
  const { data: session, status } = useSession()
  const { groupId } = useCurrentGroup()
  const { data, isLoading } = trpc.groups.getFriendDetails.useQuery({
    loggedInUserEmail: session?.user?.email || '',
    groupId,
  })
  const { mutateAsync } = trpc.groups.update.useMutation()
  const utils = trpc.useUtils()

  if (isLoading) return <></>

  return (
    <FriendForm
      group={data?.group}
      onSubmit={async (groupFormValues, participantId) => {
        await mutateAsync({ groupId, participantId, groupFormValues })
        await utils.groups.invalidate()
      }}
      protectedParticipantIds={data?.participantsWithExpenses}
    />
  )
}
