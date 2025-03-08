'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
import { trpc } from '@/trpc/client'
import { useCurrentGroup } from '../current-friend-context'
import { CategorySummary } from '@/components/graphs/totals-categories'
import { ParticipantSummary } from '@/components/graphs/totals-participant'
import { useTranslations } from 'next-intl'

export function Graphs() {
  const { groupId, group } = useCurrentGroup()
  const t = useTranslations('Stats')
  const { data: expenseByCategory } = trpc.graphs.expenseByCategory.useQuery({ groupId })
  const { data: expensesByParticipant } = trpc.graphs.expensesByParticipant.useQuery({ groupId })

  return (
    <>
    <Card>
          <CardHeader>
          <CardTitle>
            {t('Graphs.title')}
            </CardTitle>
            <CardDescription>{t('Graphs.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
          <CategorySummary expenseByCategory={expenseByCategory?.expenseByCategory ?? []} />
          <ParticipantSummary expensesByParticipant={expensesByParticipant?.expensesByParticipant ?? []} />
            </CardContent>
    </Card>
    </>
  )
}
