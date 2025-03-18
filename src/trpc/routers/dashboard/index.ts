import { createTRPCRouter } from '@/trpc/init'
import { getUserCurrencyProcedure } from './getUserCurrency.procedure'
import { getUserStatsSpendingDataProcedure } from './getUserStatsSpendingData.procedure'
import { updateUserCurrencyProcedure } from './updateUserCurrency.procedure'

export const dashboardRouter = createTRPCRouter({
  getUserStatsSpendingData: getUserStatsSpendingDataProcedure,
  updateUserCurrency: updateUserCurrencyProcedure,
  getUserCurrency: getUserCurrencyProcedure,
})
