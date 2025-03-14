import { updateUserCurrency } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const updateUserCurrencyProcedure = baseProcedure
  .input(
    z.object({
        email: z.string(),
        currency: z.string().min(1),
    }),
  )
  .mutation(async ({ input: { email, currency } }) => {
    const updatedCurrency = await updateUserCurrency(email, currency)
    return { currency: updatedCurrency }
  })
