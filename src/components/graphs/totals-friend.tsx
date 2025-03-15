'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { getFriendWiseSpendingData } from '@/lib/dashboardApi'
import { useTranslations } from 'next-intl'
import { VictoryPie, VictoryTheme } from 'victory'

type Props = {
    expensesByFriend: NonNullable<
    Awaited<ReturnType<typeof getFriendWiseSpendingData>>
  >
  display: string
}

export function FriendSummary({ expensesByFriend, display }: Props) {
  const t = useTranslations('Dashboard')
  const trimmedExpenses = expensesByFriend.map((item) => ({
    ...item,
    friendName: item.friendName.length > 4 ? `${item.friendName.slice(0, 6)}...` : item.friendName,
  }))
  return (
    <Card style={{ border: 'none', display: display }}>
      <CardHeader>
        <CardDescription className="text-center">
          {t('Graphs.pieGraphCard.friendPieGraph')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 pb-0">
        <VictoryPie
          theme={VictoryTheme.material}
          name="expensesByFriend"
          data={trimmedExpenses}
          x="friendName"
          y="total"
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
