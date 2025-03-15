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
  const trimmedExpenses = expensesByParticipant.map((item) => ({
    ...item,
    participant:
      item.participant && item.participant.length > 4
        ? `${item.participant.slice(0, 6)}...`
        : item.participant,
  }))
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
          data={trimmedExpenses}
          x="participant"
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
