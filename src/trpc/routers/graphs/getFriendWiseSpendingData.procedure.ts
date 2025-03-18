import { getFriendWiseSpendingData } from '@/lib/dashboardApi'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getFriendWiseSpendingDataProcedure = baseProcedure
  .input(z.object({ email: z.string().email('invalidEmail') }))
  .query(async ({ input: { email } }) => {
    const friendWiseSpendingExpenseData = await getFriendWiseSpendingData(email)
    return { friendWiseSpendingExpenseData }
  })
