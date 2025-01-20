import { createTRPCRouter } from '@/trpc/init'
import { listExpenseActivityProcedure } from '@/trpc/routers/groups/expenses/activity/list.procedure'

export const expenseActivityRouter = createTRPCRouter({
  list: listExpenseActivityProcedure,
})
