import { getGroupWiseSpendingData } from '@/lib/dashboardApi'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getGroupWiseSpendingDataProcedure = baseProcedure
  .input(z.object({ email: z.string().email('invalidEmail') }))
  .query(async ({ input: { email } }) => {
    const groupWiseSpendingExpenseData = await getGroupWiseSpendingData(email)
    return { groupWiseSpendingExpenseData }
  })
