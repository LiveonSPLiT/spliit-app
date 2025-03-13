import { createTRPCRouter } from '@/trpc/init'
import { getGroupExpensesByCategoryProcedure } from './getGroupExpensesByCategory.procedure'
import { getGroupExpensesByParticipantProcedure } from './getGroupExpensesByParticipant.procedre'

export const graphsRouter = createTRPCRouter({
  expenseByCategory: getGroupExpensesByCategoryProcedure,
  expensesByParticipant: getGroupExpensesByParticipantProcedure,
})
