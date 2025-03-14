import { createTRPCRouter } from '@/trpc/init'
import { getUserStatsSpendingDataProcedure } from './getUserStatsSpendingData.procedure'
import { updateUserCurrencyProcedure } from './updateUserCurrency.procedure'
import { getUserCurrencyProcedure } from './getUserCurrency.procedure'

export const dashboardRouter = createTRPCRouter({ 
    getUserStatsSpendingData: getUserStatsSpendingDataProcedure,
    updateUserCurrency: updateUserCurrencyProcedure,
    getUserCurrency: getUserCurrencyProcedure,
})