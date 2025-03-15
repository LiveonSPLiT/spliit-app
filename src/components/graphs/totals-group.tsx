'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { getGroupWiseSpendingData } from '@/lib/dashboardApi'
import { useTranslations } from 'next-intl'
import { VictoryPie, VictoryTheme } from 'victory'

type Props = {
  expensesByGroup: NonNullable<
    Awaited<ReturnType<typeof getGroupWiseSpendingData>>
  >
  display: string
}

export function GroupSummary({ expensesByGroup, display }: Props) {
  const t = useTranslations('Dashboard')
  const trimmedExpenses = expensesByGroup.map((item) => ({
    ...item,
    groupName:
      item.groupName.length > 4
        ? `${item.groupName.slice(0, 6)}...`
        : item.groupName,
  }))
  return (
    <Card style={{ border: 'none', display: display }}>
      <CardHeader>
        <CardDescription className="text-center">
          {t('Graphs.pieGraphCard.groupPieGraph')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 pb-0">
        <VictoryPie
          theme={VictoryTheme.material}
          name="expensesByGroup"
          data={trimmedExpenses}
          x="groupName"
          y="total"
          sortKey="total"
          sortOrder="descending"
          colorScale="qualitative"
          style={{
            labels: {
              fontSize: 14,
            },
            parent: { overflow: 'visible' },
          }}
        />
      </CardContent>
    </Card>
  )
}
