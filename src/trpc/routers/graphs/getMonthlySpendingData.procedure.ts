import { getMonthlySpendingData } from '@/lib/dashboardApi'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getMonthlySpendingDataProcedure = baseProcedure
  .input(z.object({ email: z.string().email('invalidEmail') }))
  .query(async ({ input: { email } }) => {
    const monthlySpendingExpenseData = await getMonthlySpendingData(email)
    return { monthlySpendingExpenseData }
  })
