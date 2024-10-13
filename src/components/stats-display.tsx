'use client'

import { Stats, getStatsAction } from '@/lib/stats-display-actions'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export function StatsDisplay() {
  const stats = useStats()
  const t = useTranslations('Homepage.stateCounter')

  return (
    <>
      {t('already')}{' '}
      <strong>
        {stats ? <AnimatedCounter count={stats?.groupsCount + 230} /> : '…'}
      </strong>{' '}
      {t('groups')} <br className="sm:hidden" />
      <strong>
        {stats ? <AnimatedCounter count={stats?.expensesCount + 3120} /> : '…'}
      </strong>{' '}
      {t('expenses')}
    </>
  )
}

function useStats() {
  const [stats, setStats] = useState<null | Stats>(null)

  useEffect(() => {
    getStatsAction().then(setStats).catch(console.error)
  }, [])

  return stats
}

export function AnimatedCounter({ count }: { count: number }) {
  const start = count - 10
  const [current, setCurrent] = useState(start)

  useEffect(() => {
    if (current < count) {
      const delay = 200 * (2 - 2 / ((current - start) / (count - start) + 1))
      setTimeout(() => setCurrent((c) => c + 1), delay)
    }
  }, [start, current, count])

  return (
    <span className="tabular-nums">
      {current.toLocaleString('en-IN', { useGrouping: true })}
    </span>
  )
}
