import { updateParticipantUser } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const updateParticipantUserProcedure = baseProcedure
  .input(
    z.object({
      groupId: z.string().min(1),
      participantId: z.string().min(1),
      userEmail : z.string(),
    }),
  )
  .mutation(async ({ input: { groupId, participantId, userEmail } }) => {
    await updateParticipantUser(groupId, participantId, userEmail )
  })
