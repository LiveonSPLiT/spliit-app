import { getGroupExpensesByParticipant } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getGroupExpensesByParticipantProcedure = baseProcedure
  .input(z.object({ groupId: z.string().min(1) }))
  .query(async ({ input: { groupId } }) => {
    const expensesByParticipant = await getGroupExpensesByParticipant(groupId)
    return { expensesByParticipant }
  })
