import { RecentFriendList } from '@/app/friends/recent-friend-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recently visited friends',
}

export default async function GroupsPage() {
  return <RecentFriendList />
}
