'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { getMonthlySpendingData } from '@/lib/dashboardApi'
import { useTranslations } from 'next-intl'
import { VictoryChart, VictoryBar, VictoryTheme } from 'victory'

type Props = {
    totalMonthlyExpense: NonNullable<
    Awaited<ReturnType<typeof getMonthlySpendingData>>
  >
}

const colorMap = [
  '#45b29d',
  '#334d5c',
  '#45b29d',
  '#efc94c',
  '#e27a3f',
  '#df5a49',
  '#4f7da1',
  '#efda97',
  '#e2a37f',
  '#df948a',
  '#efda97',
  '#3f51b5',
];

export function MonthySummary({ totalMonthlyExpense }: Props) {
  const t = useTranslations('Dashboard')
  return (
    <Card style={{ border: 'none' }}>
      <CardHeader>
        <CardDescription className="text-center">
          {t('Graphs.barGraphCard.monthlyBarGraph')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 pb-0">
        <VictoryChart
                      domainPadding={{ x: 20 }}
                      theme={VictoryTheme.grayscale}
                    >
                      <VictoryBar
                      colorScale={"qualitative"}
                      x="month"
                      y="total"
                      style={{
                        data: {
                          fill: ({ index }) =>
                            typeof index === 'number'
                              ? colorMap?.reverse()[index as number]
                            : colorMap[0],
                          },
                    }}
                      data={totalMonthlyExpense} />
                    </VictoryChart>
        
      </CardContent>
    </Card>
  )
}
