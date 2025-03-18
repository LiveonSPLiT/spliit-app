import { Dashboard } from '@/app/dashboard/dashboard-helper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  return <Dashboard />
}
