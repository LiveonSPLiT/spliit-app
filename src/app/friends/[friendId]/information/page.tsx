import FriendInformation from '@/app/friends/[friendId]/information/friend-information'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Group Information',
}

export default function InformationPage({
  params: { groupId },
}: {
  params: { groupId: string }
}) {
  return <FriendInformation groupId={groupId} />
}
