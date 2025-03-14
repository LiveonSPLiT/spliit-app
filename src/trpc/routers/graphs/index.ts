import { createTRPCRouter } from '@/trpc/init'
import { getGroupExpensesByCategoryProcedure } from './getGroupExpensesByCategory.procedure'
import { getGroupExpensesByParticipantProcedure } from './getGroupExpensesByParticipant.procedre'
import { getMonthlySpendingDataProcedure } from './getMonthlySpendingData.procedure'
import { getFriendWiseSpendingDataProcedure } from './getFriendWiseSpendingData.procedure'
import { getGroupWiseSpendingDataProcedure } from './getGroupWiseSpendingData.procedure'
import { getCategoryWiseSpendingDataProcedure } from './getCategoryWiseSpendingData.procedure'

export const graphsRouter = createTRPCRouter({
  expenseByCategory: getGroupExpensesByCategoryProcedure,
  expensesByParticipant: getGroupExpensesByParticipantProcedure,
  getMonthlySpendingData: getMonthlySpendingDataProcedure,
  getFriendWiseSpendingData: getFriendWiseSpendingDataProcedure,
  getGroupWiseSpendingData: getGroupWiseSpendingDataProcedure,
  getCategoryWiseSpendingData: getCategoryWiseSpendingDataProcedure,
})
