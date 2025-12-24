'use client'

import { ShareButton } from '@/app/dashboard/share-button'
import { Stats } from '@/app/dashboard/stats'
import { Settings } from '@/app/dashboard/user-settings'
import { Button } from '@/components/ui/button'
import { Currency } from '@/lib/currency'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/trpc/client'
import { Contact, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { PropsWithChildren, useEffect, useState } from 'react'

export function Dashboard({ children }: PropsWithChildren<{}>) {
  const defaultCurrency: Currency = {
    name: 'Indian Rupee',
    symbol_native: '₹',
    symbol: '₹',
    code: 'INR',
    name_plural: 'Indian rupees',
    rounding: 0,
    decimal_digits: 2
  }
  const t = useTranslations('Dashboard')
  const { data: session, status } = useSession()
  const userName = t('greeting') + session?.user?.name
  const userEmail = session?.user?.email ?? ''

  const [currency, setCurrency] = useState<string | null>()
  const [currencyObject, setCurrencyObject] = useState<Currency | null>()
  const { data, isLoading: currencyIsLoading } =
    trpc.dashboard.getUserCurrency.useQuery({ email: userEmail })

  useEffect(() => {
    if (data?.currency) {
      setCurrency(data.currency)
      setCurrencyObject(data.currencyObj)
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
        <div className="flex gap-3">
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
          <ShareButton
            userName={session?.user?.name ?? ''}
            userEmail={userEmail}
          />
        </div>
      </div>
      <Stats userEmail={userEmail} currency={currencyObject ?? defaultCurrency} />
      <Settings
        userEmail={userEmail}
        currency={currency ?? ''}
        currencyCode={currencyObject?.code ?? 'INR'}
        notificationPrefre={data?.notificationPrefrence ?? 'BOTH'}
        loading={currencyIsLoading}
        onCurrencyUpdate={handleCurrencyUpdate}
      />
    </>
  )
}
