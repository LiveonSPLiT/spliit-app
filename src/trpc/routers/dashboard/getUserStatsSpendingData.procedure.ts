import {
  getTotalFriendSpendings,
  getTotalGroupSpendings,
  getTotalSpendings,
  getTotalSpendingsCurrentMonth,
} from '@/lib/dashboardApi'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getUserStatsSpendingDataProcedure = baseProcedure
  .input(z.object({ email: z.string().email('invalidEmail') }))
  .query(async ({ input: { email } }) => {
    const totalSpendingsData = await getTotalSpendings(email)
    const totalSpendingsCurrentMonthData =
      await getTotalSpendingsCurrentMonth(email)
    const getTotalGroupSpendingsData = await getTotalGroupSpendings(email)
    const getTotalFriendSpendingsData = await getTotalFriendSpendings(email)
    return {
      totalSpendingsData,
      totalSpendingsCurrentMonthData,
      getTotalGroupSpendingsData,
      getTotalFriendSpendingsData,
    }
  })
