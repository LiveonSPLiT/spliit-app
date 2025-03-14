'use client'


import { Button } from '@/components/ui/button'
import { Contact, Users, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Stats } from '@/app/dashboard/stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Currency } from '@/app/dashboard/user-currency'
import { trpc } from '@/trpc/client'

export function Dashboard({ children }: PropsWithChildren<{}>) {
  const t = useTranslations('Dashboard')
  const { data: session, status } = useSession()
  const userName = t('greeting') + session?.user?.name
  const userEmail = session?.user?.email ?? ''
  
  
  const [currency, setCurrency] = useState<string | null>()
  const { data, isLoading: currencyIsLoading } = trpc.dashboard.getUserCurrency.useQuery({ email: userEmail })

  useEffect(() => {
    if (data?.currency) {
      setCurrency(data.currency)
      localStorage.setItem('user-currency', data.currency)
    }
  }, [data])

  const handleCurrencyUpdate = (newCurrency: string) => {
    localStorage.setItem('user-currency', newCurrency)
    setCurrency(newCurrency)
  }


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
      <Stats userEmail={userEmail} currency={currency ?? ''}/>
      {currencyIsLoading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> 
      : <Currency userEmail={userEmail} currency={currency ?? ''} onCurrencyUpdate={handleCurrencyUpdate} />}
      
    </>
  )
}
