import { getUserCurrency } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { getCurrency } from '@/lib/currency'
import { z } from 'zod'

export const getUserCurrencyProcedure = baseProcedure
  .input(z.object({ email: z.string().email('invalidEmail') }))
  .query(async ({ input: { email } }) => {
    const user = await getUserCurrency(email)
    const currency = getCurrency(user?.currencyCode)
    return {
      currency: user?.currency ?? '₹',
      currencyObj: currency,
      notificationPrefrence: user?.notificationPref ?? 'BOTH',
    }
  })
