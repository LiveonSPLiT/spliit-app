import { ActivityPageClient } from '@/app/groups/[groupId]/activity/page.client'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Activity',
}

export default async function ActivityPage() {
  return <ActivityPageClient />
}