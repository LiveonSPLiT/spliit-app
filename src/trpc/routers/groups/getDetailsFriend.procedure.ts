import { getFriend, getGroupExpensesParticipants } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const getFriendDetailsProcedure = baseProcedure
.input(z.object({ 
    loggedInUserEmail: z.string(),
    groupId: z.string().min(1), }))
  .query(async ({ input: { loggedInUserEmail, groupId } }) => {
    const group = await getFriend(loggedInUserEmail, groupId)
    if (!group) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Group not found.',
      })
    }

    const participantsWithExpenses = await getGroupExpensesParticipants(groupId)
    return { group, participantsWithExpenses }
  })
