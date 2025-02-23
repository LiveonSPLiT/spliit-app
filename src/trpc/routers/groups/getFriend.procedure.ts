import { getFriend } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getFriendProcedure = baseProcedure
  .input(z.object({ 
    loggedInUserEmail: z.string(),
    groupId: z.string().min(1), }))
  .query(async ({ input: { loggedInUserEmail, groupId } }) => {
    const group = await getFriend(loggedInUserEmail, groupId)
    return { group }
  })
