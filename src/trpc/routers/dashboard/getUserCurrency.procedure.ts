import { getUserCurrency } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const getUserCurrencyProcedure = baseProcedure
  .input(z.object({ email: z.string().email('invalidEmail') }))
  .query(async ({ input: { email } }) => {
    const user = await getUserCurrency(email)
    return { currency: user?.currency ?? '₹' , notificationPrefrence: user?.notificationPref ?? 'BOTH' }
  })
