import { CreateFriend } from '@/app/friends/create/create-friend'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Friend',
}

export default function CreateGroupPage() {
  return <CreateFriend />
}
