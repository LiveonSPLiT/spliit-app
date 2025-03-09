import { categoriesRouter } from '@/trpc/routers/categories'
import { graphsRouter } from '@/trpc/routers/graphs'
import { groupsRouter } from '@/trpc/routers/groups'
import { inferRouterOutputs } from '@trpc/server'
import { createTRPCRouter } from '../init'

export const appRouter = createTRPCRouter({
  groups: groupsRouter,
  categories: categoriesRouter,
  graphs: graphsRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterOutput = inferRouterOutputs<AppRouter>
