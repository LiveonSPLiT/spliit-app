'use client'

import { FriendForm } from '@/components/friend-form'
import { trpc } from '@/trpc/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const CreateFriend = () => {
  const { mutateAsync } = trpc.groups.createFriend.useMutation()
  const utils = trpc.useUtils()
  const router = useRouter()
  const { data: session, status } = useSession()

  return (
    <FriendForm
      onSubmit={async (groupFormValues) => {
        groupFormValues.loggedInEmail = session?.user?.email || ''
        const { group } = await mutateAsync({ groupFormValues })
        await utils.groups.invalidate()
        router.push(`/friends/${group.id}`)
      }}
    />
  )
}
