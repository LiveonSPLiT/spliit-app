import { createTRPCRouter } from '@/trpc/init'
import { getCategoryWiseSpendingDataProcedure } from './getCategoryWiseSpendingData.procedure'
import { getFriendWiseSpendingDataProcedure } from './getFriendWiseSpendingData.procedure'
import { getGroupExpensesByCategoryProcedure } from './getGroupExpensesByCategory.procedure'
import { getGroupExpensesByParticipantProcedure } from './getGroupExpensesByParticipant.procedre'
import { getGroupWiseSpendingDataProcedure } from './getGroupWiseSpendingData.procedure'
import { getMonthlySpendingDataProcedure } from './getMonthlySpendingData.procedure'

export const graphsRouter = createTRPCRouter({
  expenseByCategory: getGroupExpensesByCategoryProcedure,
  expensesByParticipant: getGroupExpensesByParticipantProcedure,
  getMonthlySpendingData: getMonthlySpendingDataProcedure,
  getFriendWiseSpendingData: getFriendWiseSpendingDataProcedure,
  getGroupWiseSpendingData: getGroupWiseSpendingDataProcedure,
  getCategoryWiseSpendingData: getCategoryWiseSpendingDataProcedure,
})
