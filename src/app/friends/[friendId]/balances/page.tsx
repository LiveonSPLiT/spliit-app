import BalancesAndReimbursements from '@/app/friends/[friendId]/balances/balances-and-reimbursements'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Balances',
}

export default async function GroupPage() {
  return <BalancesAndReimbursements />
}
