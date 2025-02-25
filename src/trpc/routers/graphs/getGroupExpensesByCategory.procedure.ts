import { getGroupExpensesByCategory } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getGroupExpensesByCategoryProcedure = baseProcedure
  .input(z.object({ groupId: z.string().min(1) }))
  .query(async ({ input: { groupId } }) => {
    const expenseByCategory = await getGroupExpensesByCategory(groupId)
    return { expenseByCategory }
  })
