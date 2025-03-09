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
  expensesByParticipant: NonNullable<
    Awaited<ReturnType<typeof getGroupExpensesByParticipant>>
  >
}

export function ParticipantSummary({ expensesByParticipant }: Props) {
  const t = useTranslations('Stats')
  return (
    <Card style={{ border: 'none' }}>
      <CardHeader>
        <CardDescription className="text-center">
          {t('Graphs.participants')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 pb-0">
        <VictoryPie
          theme={VictoryTheme.material}
          name="expenseByCategory"
          data={expensesByParticipant}
          x="participant"
          y="amount"
          sortKey="amount"
          sortOrder="descending"
          colorScale="qualitative"
          style={{
            labels: {
              fontSize: 12,
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
