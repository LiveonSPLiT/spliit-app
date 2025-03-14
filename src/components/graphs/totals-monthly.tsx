'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { getMonthlySpendingData } from '@/lib/dashboardApi'
import { useTranslations } from 'next-intl'
import { VictoryAxis, VictoryChart, VictoryBar, VictoryTheme } from 'victory'

type Props = {
    totalMonthlyExpense: NonNullable<
    Awaited<ReturnType<typeof getMonthlySpendingData>>
  >
}

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
                      theme={VictoryTheme.clean}
                    >
                      <VictoryBar
                      colorScale={"qualitative"}
                      x="month"
                      y="total"
                      data={totalMonthlyExpense} />
                      <VictoryAxis style={{
                        tickLabels: {fill: '#455A64'}
                      }}/> 
                      <VictoryAxis dependentAxis style={{
                        tickLabels: {fill: '#455A64'}
                      }}/>
                    </VictoryChart>
        
      </CardContent>
    </Card>
  )
}
