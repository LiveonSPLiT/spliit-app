'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { getMonthlySpendingData } from '@/lib/dashboardApi'
import { useTranslations } from 'next-intl'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory'

type Props = {
  totalMonthlyExpense: NonNullable<
    Awaited<ReturnType<typeof getMonthlySpendingData>>
  >
  currency: string
}

export function MonthySummary({ totalMonthlyExpense, currency }: Props) {
  const t = useTranslations('Dashboard')
  const hasNonZeroData = totalMonthlyExpense.some((data) => data.total > 0)
  const yDomain: [number, number] | undefined = hasNonZeroData
    ? undefined
    : [0, 10]
  return (
    <Card style={{ border: 'none' }}>
      <CardHeader>
        <CardDescription>
          {t('Graphs.barGraphCard.monthlyBarGraph')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col pb-0">
        <VictoryChart
          domainPadding={{ x: 20 }}
          theme={VictoryTheme.clean}
          domain={{ y: yDomain }}
        >
          <VictoryBar
            colorScale={'qualitative'}
            x="month"
            y="total"
            data={totalMonthlyExpense}
          />
          <VictoryAxis
            style={{
              tickLabels: { fill: '#455A64' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(tick) => `${currency}${tick}`}
            style={{
              tickLabels: { fill: '#455A64' },
            }}
          />
        </VictoryChart>
      </CardContent>
    </Card>
  )
}
