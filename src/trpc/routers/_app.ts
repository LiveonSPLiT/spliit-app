import { categoriesRouter } from '@/trpc/routers/categories'
import { graphsRouter } from '@/trpc/routers/graphs'
import { groupsRouter } from '@/trpc/routers/groups'
import { dashboardRouter } from '@/trpc/routers/dashboard'
import { inferRouterOutputs } from '@trpc/server'
import { createTRPCRouter } from '../init'

export const appRouter = createTRPCRouter({
  groups: groupsRouter,
  categories: categoriesRouter,
  graphs: graphsRouter,
  dashboard: dashboardRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterOutput = inferRouterOutputs<AppRouter>
