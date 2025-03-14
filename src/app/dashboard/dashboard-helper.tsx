'use client'

import { Button } from '@/components/ui/button'
import { Contact, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Stats } from '@/app/dashboard/stats'
import { Skeleton } from '@/components/ui/skeleton'

export function Dashboard({ children }: PropsWithChildren<{}>) {
  const t = useTranslations('Dashboard')
  const { data: session, status } = useSession()
  const userName = t('greeting') + session?.user?.name


  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="font-bold text-2xl flex-1">
          {status === 'loading' ? <Skeleton className="h-8 w-48" /> : userName}
        </h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/groups">
              <Users className="w-4 h-4 mr-2" />
              {t('groupsButton')}
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/friends">
              <Contact className="w-4 h-4 mr-2" />
              {t('friendsButton')}
            </Link>
          </Button>
        </div>
      </div>
      <Stats />
    </>
  )
}
