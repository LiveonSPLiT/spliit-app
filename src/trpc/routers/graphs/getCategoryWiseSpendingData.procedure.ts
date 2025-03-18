import { getCategoryWiseSpendingData } from '@/lib/dashboardApi'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getCategoryWiseSpendingDataProcedure = baseProcedure
  .input(z.object({ email: z.string().email('invalidEmail') }))
  .query(async ({ input: { email } }) => {
    const categoryWiseSpendingExpenseData =
      await getCategoryWiseSpendingData(email)
    return { categoryWiseSpendingExpenseData }
  })
