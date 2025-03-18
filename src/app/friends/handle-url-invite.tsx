'use client'

import { saveRecentFriend } from '@/app/friends/recent-friends-helpers'
import { GroupFormValues } from '@/lib/schemas'
import { trpc } from '@/trpc/client'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function HandleUrlInvite() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutateAsync } = trpc.groups.createFriend.useMutation()
  const utils = trpc.useUtils()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleInvite = async () => {
      const currentUrl = window.location.href

      // Verify if the URL starts with "https://liveonsplit.com/friends"
      if (currentUrl.startsWith('https://liveonsplit.com/friends?add')) {
        const params = new URLSearchParams(new URL(currentUrl).search)
        const email = params?.get('add')
        const name = params?.get('name')

        if (email && name) {
          const groupFormValues: GroupFormValues = {
            name,
            friendEmail: email,
            loggedInEmail: session?.user?.email || '',
            information: '',
            currency: localStorage.getItem('user-currency') ?? '₹',
            participants: [{ name }],
          }

          try {
            const { group } = await mutateAsync({ groupFormValues })
            await utils.groups.invalidate()
            if (group) {
              saveRecentFriend({ id: group.id, name: group.name })
              router.replace(
                `https://liveonsplit.com/friends/${group.id}/expenses`,
              ) // Redirect after processing
            }
          } catch (error) {
            console.error('Error creating friend group:', error)
          }
        }
      }
    }

    handleInvite()
  }, [searchParams, router, session, utils.groups, mutateAsync])

  return null // No UI rendering needed
}
