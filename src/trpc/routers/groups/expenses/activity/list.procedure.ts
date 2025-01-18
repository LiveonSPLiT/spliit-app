import { getExpenseActivity } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const listExpenseActivityProcedure = baseProcedure
  .input(z.object({ expenseId: z.string().min(1) }))
  .query(async ({ input: { expenseId } }) => {
    const activities = await getExpenseActivity(expenseId)
    if (!activities) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Comment not found',
      })
    }
    return { activities }
  })
