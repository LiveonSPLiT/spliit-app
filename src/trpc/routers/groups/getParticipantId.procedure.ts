import { getLoggedUserParticipantId } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getParticipantIdProcedure = baseProcedure
  .input(
    z.object({
      loggedInUserEmail: z.string(),
      groupId: z.string().min(1),
    }),
  )
  .query(async ({ input: { loggedInUserEmail, groupId } }) => {
    const participantId = await getLoggedUserParticipantId(
      groupId,
      loggedInUserEmail,
    )
    return participantId
  })
