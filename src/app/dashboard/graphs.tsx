'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/trpc/client'
import { useTranslations } from 'next-intl'
import { VictoryPie, VictoryTheme, VictoryChart, VictoryBar, VictoryAxis } from 'victory'
import { FriendSummary } from '@/components/graphs/totals-friend'
import { GroupSummary } from '@/components/graphs/totals-group'
import { MonthySummary } from '@/components/graphs/totals-monthly'


export function Graphs() {
  
  const t = useTranslations('Dashboard')
  
  

  const isLoading = true

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('Graphs.barGraphCard.title')}</CardTitle>
          <CardDescription>{t('Graphs.barGraphCard.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <BarGraphLoading />
          ) : (
            <MonthySummary totalMonthlyExpense={[]} />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('Graphs.pieGraphCard.title')}</CardTitle>
          <CardDescription>{t('Graphs.pieGraphCard.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <GraphsLoading />
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              <GroupSummary expensesByGroup={[]} />
              <FriendSummary expensesByFriend={[]} />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

const BarGraphLoading = ({}) => {
  return (
      <Card style={{ border: 'none' }}>
            <CardHeader>
              <div className="text-sm text-muted-foreground text-center">
                <Skeleton className="h-4 w-64" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col w-4/5 pb-0 animate-pulse rounded-md">
            <VictoryChart
              domainPadding={{ x: 20 }}
              theme={VictoryTheme.grayscale}
            >
              <VictoryBar
              data={[
                { x: "Jan", y: 2000 },
                { x: "Feb", y: 3000 },
                { x: "Mar", y: 4000 },
                { x: "Apr", y: 2500 },
                { x: "May", y: 6000 },
              ]} />
              <VictoryAxis tickFormat={() => ""} /> 
              <VictoryAxis dependentAxis tickFormat={() => ""} />
            </VictoryChart>
            </CardContent>
      </Card>
  )
}

const GraphsLoading = ({}) => {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {Array(2)
        .fill(undefined)
        .map((_, index) => (
          <Card key={index} style={{ border: 'none' }}>
            <CardHeader>
              <div className="text-sm text-muted-foreground text-center">
                <Skeleton className="h-4 w-64" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 pb-0 animate-pulse rounded-md">
              <VictoryPie
                theme={VictoryTheme.material}
                data={[{ y: 25 }, { y: 20 }, { y: 35 }]}
                colorScale="qualitative"
                labels={[]}
                style={{
                  data: {
                    fillOpacity: 0.9,
                    stroke: '#737373',
                    strokeWidth: 3,
                    fill: '#1e1d1d',
                  },
                }}
              />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

