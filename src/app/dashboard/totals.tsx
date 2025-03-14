'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatCurrency } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { trpc } from '@/trpc/client'

type TotalsProps = {
  userEmail: string
  currency: string
}

type TotalsSpendingEverythingProps = {
  totalSpendingsEverything: number
  currency: string
}

function TotalsSpendingEverything({ totalSpendingsEverything, currency }: TotalsSpendingEverythingProps) {
  const locale = useLocale()
  const t = useTranslations('Dashboard.Totals')
  return (
    <div>
      <div className="text-muted-foreground">{t('yourSpendings')}</div>
      <div className="text-lg">
        {formatCurrency(currency, Math.abs(totalSpendingsEverything), locale)}
      </div>
    </div>
  )
}

function TotalsCurrentMonthSpendings({
  totalMonthSpendings = 0,
  currency,
}: {
  totalMonthSpendings?: number
  currency: string
}) {
  const locale = useLocale()
  const t = useTranslations('Dashboard.Totals')

  return (
    <div>
      <div className="text-muted-foreground">{t('currentMonthSpendings')}</div>
      <div
        className={cn(
          'text-lg',
          totalMonthSpendings < 0 ? 'text-green-600' : 'text-red-600',
        )}
      >
        {formatCurrency(currency, Math.abs(totalMonthSpendings), locale)}
      </div>
    </div>
  )
}

function TotalsYourGroupSpending({
  totalGroupSpending = 0,
  currency,
}: {
  totalGroupSpending?: number
  currency: string
}) {
  const locale = useLocale()
  const t = useTranslations('Dashboard.Totals')

  const balance = totalGroupSpending < 0 ? 'groupEarnings' : 'groupSpendings'
  return (
    <div>
      <div className="text-muted-foreground">{t(balance)}</div>
      <div
        className={cn(
          'text-lg',
          totalGroupSpending < 0 ? 'text-green-600' : 'text-red-600',
        )}
      >
        {formatCurrency(currency, Math.abs(totalGroupSpending), locale)}
      </div>
    </div>
  )
}

function TotalsYourFriendSpending({
  totalFriendSpending = 0,
  currency,
}: {
  totalFriendSpending?: number
  currency: string
}) {
  const locale = useLocale()
  const t = useTranslations('Dashboard.Totals')
  const balance = totalFriendSpending < 0 ? 'friendEarnings' : 'friendSpendings'

  return (
    <div>
      <div className="text-muted-foreground">{t(balance)}</div>
      <div
        className={cn(
          'text-lg',
          totalFriendSpending < 0 ? 'text-green-600' : 'text-red-600',
        )}
      >
        {formatCurrency(currency, Math.abs(totalFriendSpending), locale)}
      </div>
    </div>
  )
}

export function Totals(
  {userEmail, currency}: TotalsProps
) {

  const { data: statsData, isLoading: statsDataIsLoading } = trpc.dashboard.getUserStatsSpendingData.useQuery({ email: userEmail })

  const isLoading = statsDataIsLoading || !currency || !userEmail

  if (isLoading){
    return (
      <div className="grid sm:grid-cols-2 gap-7">
        {[0, 1, 2, 3].map((index) => (
          <div key={index}>
            <Skeleton className="mt-1 h-3 w-48" />
            <Skeleton className="mt-3 h-4 w-20" />
          </div>
        ))}
    </div>
    )
  }
  return (
    <>
    <div className="grid sm:grid-cols-2 gap-7">
    <TotalsSpendingEverything
    totalSpendingsEverything={statsData?.totalSpendingsData ?? 0}
    currency={currency}
    />
    <TotalsCurrentMonthSpendings
    totalMonthSpendings={statsData?.totalSpendingsCurrentMonthData ?? 0} currency={currency}
    />
    <TotalsYourGroupSpending
    totalGroupSpending={statsData?.getTotalGroupSpendingsData ?? 0} currency={currency}
    />
    <TotalsYourFriendSpending totalFriendSpending={statsData?.getTotalFriendSpendingsData ?? 0} currency={currency} />
    </div>
    </>
  )
}
