'use client'

import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/trpc/client'
import { useTranslations } from 'next-intl'
import { PropsWithChildren, useEffect } from 'react'
import { CurrentGroupProvider } from './current-friend-context'
import { FriendHeader } from './friend-header'
import { SaveFriendLocally } from './save-recent-friend'
import { useSession } from 'next-auth/react'

export function GroupLayoutClient({
  groupId,
  children,
}: PropsWithChildren<{ groupId: string }>) {
  const { data: session, status } = useSession()
  const { data, isLoading } = trpc.groups.getFriend.useQuery({ loggedInUserEmail: session?.user?.email || '', groupId })
  const t = useTranslations('Friends.NotFound')
  const { toast } = useToast()

  useEffect(() => {
    if (data && !data.group) {
      toast({
        description: t('text'),
        variant: 'destructive',
      })
    }
  }, [data])

  const props =
    isLoading || !data?.group
      ? { isLoading: true as const, groupId, group: undefined }
      : { isLoading: false as const, groupId, group: data.group }

  if (isLoading) {
    return (
      <CurrentGroupProvider {...props}>
        <FriendHeader />
        {children}
      </CurrentGroupProvider>
    )
  }

  return (
    <CurrentGroupProvider {...props}>
      <FriendHeader />
      {children}
      <SaveFriendLocally />
    </CurrentGroupProvider>
  )
}
