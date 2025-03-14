'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { getGroupExpensesByParticipant } from '@/lib/api'
import { useTranslations } from 'next-intl'
import { VictoryPie, VictoryTheme } from 'victory'

type Props = {
    expensesByGroup: NonNullable<
    Awaited<ReturnType<typeof getGroupExpensesByParticipant>>
  >
}

export function GroupSummary({ expensesByGroup }: Props) {
  const t = useTranslations('Dashboard')
  return (
    <Card style={{ border: 'none' }}>
      <CardHeader>
        <CardDescription className="text-center">
          {t('Graphs.pieGraphCard.groupPieGraph')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 pb-0">
        <VictoryPie
          theme={VictoryTheme.material}
          name="expensesByGroup"
          data={expensesByGroup}
          x="group"
          y="amount"
          sortKey="amount"
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
