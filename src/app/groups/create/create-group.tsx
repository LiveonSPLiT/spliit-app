'use client'

import { GroupForm } from '@/components/group-form'
import { trpc } from '@/trpc/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const CreateGroup = () => {
  const { mutateAsync } = trpc.groups.create.useMutation()
  const utils = trpc.useUtils()
  const router = useRouter()
  const { data: session, status } = useSession()

  return (
    <GroupForm
      onSubmit={async (groupFormValues) => {
        groupFormValues.loggedInEmail = session?.user?.email || ''
        const { groupId } = await mutateAsync({ groupFormValues })
        await utils.groups.invalidate()
        router.push(`/groups/${groupId}`)
      }}
    />
  )
}
