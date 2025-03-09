'use client'
import { CategorySummary } from '@/components/graphs/totals-categories'
import { ParticipantSummary } from '@/components/graphs/totals-participant'
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
import { VictoryPie, VictoryTheme } from 'victory'
import { useCurrentGroup } from '../current-group-context'

export function Graphs() {
  const { groupId, group } = useCurrentGroup()
  const t = useTranslations('Stats')
  const { data: expenseByCategory, isLoading: categoryAreLoading } =
    trpc.graphs.expenseByCategory.useQuery({ groupId })
  const { data: expensesByParticipant, isLoading: participantAreLoading } =
    trpc.graphs.expensesByParticipant.useQuery({ groupId })

  const isLoading = categoryAreLoading || participantAreLoading || !group

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('Graphs.title')}</CardTitle>
          <CardDescription>{t('Graphs.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <GraphsLoading />
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              <CategorySummary
                expenseByCategory={expenseByCategory?.expenseByCategory ?? []}
              />
              <ParticipantSummary
                expensesByParticipant={
                  expensesByParticipant?.expensesByParticipant ?? []
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
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
