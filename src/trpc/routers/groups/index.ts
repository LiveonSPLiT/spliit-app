import { createTRPCRouter } from '@/trpc/init'
import { activitiesRouter } from '@/trpc/routers/groups/activities'
import { groupBalancesRouter } from '@/trpc/routers/groups/balances'
import { createGroupProcedure } from '@/trpc/routers/groups/create.procedure'
import { groupExpensesRouter } from '@/trpc/routers/groups/expenses'
import { getGroupProcedure } from '@/trpc/routers/groups/get.procedure'
import { groupStatsRouter } from '@/trpc/routers/groups/stats'
import { updateGroupProcedure } from '@/trpc/routers/groups/update.procedure'
import { createFriendProcedure } from './createFriend.procedure'
import { getGroupDetailsProcedure } from './getDetails.procedure'
import { getFriendDetailsProcedure } from './getDetailsFriend.procedure'
import { getFriendProcedure } from './getFriend.procedure'
import { getParticipantIdProcedure } from './getParticipantId.procedure'
import { listGroupsProcedure } from './list.procedure'
import { updateParticipantUserProcedure } from './updateParticipantUser.procedure'

export const groupsRouter = createTRPCRouter({
  expenses: groupExpensesRouter,
  balances: groupBalancesRouter,
  stats: groupStatsRouter,
  activities: activitiesRouter,

  get: getGroupProcedure,
  getDetails: getGroupDetailsProcedure,
  list: listGroupsProcedure,
  create: createGroupProcedure,
  update: updateGroupProcedure,
  createFriend: createFriendProcedure,
  getFriend: getFriendProcedure,
  getParticipantId: getParticipantIdProcedure,
  getFriendDetails: getFriendDetailsProcedure,
  updateParticipantUser: updateParticipantUserProcedure,
})
