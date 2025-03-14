import { createTRPCRouter } from '@/trpc/init'
import { getUserStatsSpendingDataProcedure } from './getUserStatsSpendingData.procedure'

export const dashboardRouter = createTRPCRouter({ 
    getUserStatsSpendingData: getUserStatsSpendingDataProcedure,
})