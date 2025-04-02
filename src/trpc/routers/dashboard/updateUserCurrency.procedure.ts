import { updateUserCurrency } from '@/lib/api'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'
import { subscribeUser, unsubscribeUser } from '@/lib/pushNotification'

export const updateUserCurrencyProcedure = baseProcedure
  .input(
    z.object({
      email: z.string(),
      currency: z.string().min(1),
      pushSubscription: z.any(),
      notificationPref: z.string(),
    }),
  )
  .mutation(async ({ input: { email, currency, pushSubscription, notificationPref } }) => {
    const updatedCurrency = await updateUserCurrency(email, currency)
    if (notificationPref === 'BOTH') {
      const subscription = await subscribeUser(pushSubscription, email)
    } else if (notificationPref === 'EMAIL') {
      const subscription = await unsubscribeUser(email)
    }
    return { currency: updatedCurrency }
  })
