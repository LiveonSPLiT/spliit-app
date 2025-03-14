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
    expensesByFriend: NonNullable<
    Awaited<ReturnType<typeof getGroupExpensesByParticipant>>
  >
}

export function FriendSummary({ expensesByFriend }: Props) {
  const t = useTranslations('Dashboard')
  return (
    <Card style={{ border: 'none' }}>
      <CardHeader>
        <CardDescription className="text-center">
          {t('Graphs.pieGraphCard.friendPieGraph')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 pb-0">
        <VictoryPie
          theme={VictoryTheme.material}
          name="expensesByFriend"
          data={expensesByFriend}
          x="friend"
          y="amount"
          colorScale="qualitative"
          innerRadius={50}
          padAngle={5}
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
