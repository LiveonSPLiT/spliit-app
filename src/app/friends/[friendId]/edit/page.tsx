import { EditFriend } from '@/app/friends/[friendId]/edit/edit-friend'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function EditGroupPage() {
  return <EditFriend />
}
