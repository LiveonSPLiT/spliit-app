import { ActivityPageClient } from '@/app/friends/[friendId]/activity/page.client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Activity',
}

export default async function ActivityPage() {
  return <ActivityPageClient />
}
