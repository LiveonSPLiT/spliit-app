import { createGroup, updateParticipantUser } from '@/lib/api'
import { getUserByEmail } from '@/lib/dashboardApi'
import { groupFormSchema } from '@/lib/schemas'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const createGroupProcedure = baseProcedure
  .input(
    z.object({
      groupFormValues: groupFormSchema,
    }),
  )
  .mutation(async ({ input: { groupFormValues } }) => {
    const group = await createGroup(groupFormValues)
    const user = await getUserByEmail(groupFormValues.loggedInEmail || '')
    const participantId = group.participants.find((p) => p.name === user?.name)
      ?.id
    if (participantId) {
      await updateParticipantUser(
        group.id,
        participantId,
        groupFormValues.loggedInEmail || '',
      )
    }
    return { groupId: group.id }
  })
