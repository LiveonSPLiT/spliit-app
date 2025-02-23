'use client'

import { FriendForm } from '@/components/friend-form'
import { trpc } from '@/trpc/client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export const CreateFriend = () => {
  const { mutateAsync } = trpc.groups.createFriend.useMutation()
  const utils = trpc.useUtils()
  const router = useRouter()
  const { data: session, status } = useSession()

  return (
    <FriendForm
      onSubmit={async (groupFormValues) => {
        groupFormValues.loggedInEmail = session?.user?.email || ''
        const { groupId } = await mutateAsync({ groupFormValues })
        await utils.groups.invalidate()
        router.push(`/friends/${groupId}`)
      }}
    />
  )
}
