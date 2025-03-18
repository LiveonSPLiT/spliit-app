import { getUserCurrency } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getUserCurrencyProcedure = baseProcedure
  .input(z.object({ email: z.string().email('invalidEmail') }))
  .query(async ({ input: { email } }) => {
    const currency = await getUserCurrency(email)
    return { currency }
  })
