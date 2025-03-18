import { Graphs } from '@/app/dashboard/graphs'
import { Totals } from '@/app/dashboard/totals'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTranslations } from 'next-intl'

type StatsProps = {
  userEmail: string
  currency: string
}

export function Stats({ userEmail, currency }: StatsProps) {
  const t = useTranslations('Dashboard')

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t('Totals.title')}</CardTitle>
          <CardDescription>{t('Totals.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Totals userEmail={userEmail} currency={currency} />
        </CardContent>
      </Card>
      <Graphs userEmail={userEmail} currency={currency} />
    </>
  )
}
