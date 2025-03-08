import { prisma } from '@/lib/prisma'
import { ExpenseFormValues, GroupFormValues } from '@/lib/schemas'
import {
  ActivityType,
  Expense,
  ExpenseComment,
} from '@prisma/client'
import { nanoid } from 'nanoid'
import { sendActivityEmails } from './sendEmails'


export function randomId() {
  return nanoid()
}

export async function createGroup(groupFormValues: GroupFormValues) {
  return prisma.group.create({
    data: {
      id: randomId(),
      name: groupFormValues.name,
      information: groupFormValues.information,
      currency: groupFormValues.currency,
      participants: {
        createMany: {
          data: groupFormValues.participants.map(({ name }) => ({
            id: randomId(),
            name,
          })),
        },
      },
    },
    include: { participants: true },
  })
}


export async function createExpense(
  expenseFormValues: ExpenseFormValues,
  groupId: string,
  participantId?: string
): Promise<Expense> {
  const group = await getGroup(groupId)
  if (!group) throw new Error(`Invalid group ID: ${groupId}`)

  for (const participant of [
    expenseFormValues.paidBy,
    ...expenseFormValues.paidFor.map((p) => p.participant),
  ]) {
    if (!group.participants.some((p) => p.id === participant))
      throw new Error(`Invalid participant ID: ${participant}`)
  }
  const expenseId = randomId()
  await logActivity(groupId, ActivityType.CREATE_EXPENSE, {
    participantId,
    expenseId,
    data: expenseFormValues.title,
  })
  
  return prisma.expense.create({
    data: {
      id: expenseId,
      groupId,
      expenseDate: expenseFormValues.expenseDate,
      categoryId: expenseFormValues.category,
      amount: expenseFormValues.amount,
      title: expenseFormValues.title,
      paidById: expenseFormValues.paidBy,
      splitMode: expenseFormValues.splitMode,
      paidFor: {
        createMany: {
          data: expenseFormValues.paidFor.map((paidFor) => ({
            participantId: paidFor.participant,
            shares: paidFor.shares,
          })),
        },
      },
      isReimbursement: expenseFormValues.isReimbursement,
      documents: {
        createMany: {
          data: expenseFormValues.documents.map((doc) => ({
            id: randomId(),
            url: doc.url,
            width: doc.width,
            height: doc.height,
          })),
        },
      },
      notes: expenseFormValues.notes,
      location: {
        ...(expenseFormValues.location && {
          create: { ...expenseFormValues.location },
        }),
      },
    },
  })
}

export async function deleteExpense(
  groupId: string,
  expenseId: string,
  participantId?: string,
) {
  const existingExpense = await getExpense(groupId, expenseId)
  await logActivity(groupId, ActivityType.DELETE_EXPENSE, {
    participantId,
    expenseId,
    data: existingExpense?.title,
  })

  await prisma.expense.delete({
    where: { id: expenseId },
    include: { paidFor: true, paidBy: true },
  })
}

export async function getGroupExpensesParticipants(groupId: string) {
  const expenses = await getGroupExpenses(groupId)
  return Array.from(
    new Set(
      expenses.flatMap((e) => [
        e.paidBy.id,
        ...e.paidFor.map((pf) => pf.participant.id),
      ]),
    ),
  )
}

export async function getGroups(groupIds: string[]) {
  return (
    await prisma.group.findMany({
      where: { id: { in: groupIds } },
      include: { _count: { select: { participants: true } } },
    })
  ).map((group) => ({
    ...group,
    createdAt: group.createdAt.toISOString(),
  }))
}

export async function updateExpense(
  groupId: string,
  expenseId: string,
  expenseFormValues: ExpenseFormValues,
  participantId?: string,
) {
  const group = await getGroup(groupId)
  if (!group) throw new Error(`Invalid group ID: ${groupId}`)

  const existingExpense = await getExpense(groupId, expenseId)
  if (!existingExpense) throw new Error(`Invalid expense ID: ${expenseId}`)

  for (const participant of [
    expenseFormValues.paidBy,
    ...expenseFormValues.paidFor.map((p) => p.participant),
  ]) {
    if (!group.participants.some((p) => p.id === participant))
      throw new Error(`Invalid participant ID: ${participant}`)
  }
  await logActivity(groupId, ActivityType.UPDATE_EXPENSE, {
    participantId,
    expenseId,
    data: expenseFormValues.title,
  })

  return prisma.expense.update({
    where: { id: expenseId },
    data: {
      expenseDate: expenseFormValues.expenseDate,
      amount: expenseFormValues.amount,
      title: expenseFormValues.title,
      categoryId: expenseFormValues.category,
      paidById: expenseFormValues.paidBy,
      splitMode: expenseFormValues.splitMode,
      paidFor: {
        create: expenseFormValues.paidFor
          .filter(
            (p) =>
              !existingExpense.paidFor.some(
                (pp) => pp.participantId === p.participant,
              ),
          )
          .map((paidFor) => ({
            participantId: paidFor.participant,
            shares: paidFor.shares,
          })),
        update: expenseFormValues.paidFor.map((paidFor) => ({
          where: {
            expenseId_participantId: {
              expenseId,
              participantId: paidFor.participant,
            },
          },
          data: {
            shares: paidFor.shares,
          },
        })),
        deleteMany: existingExpense.paidFor.filter(
          (paidFor) =>
            !expenseFormValues.paidFor.some(
              (pf) => pf.participant === paidFor.participantId,
            ),
        ),
      },
      isReimbursement: expenseFormValues.isReimbursement,
      documents: {
        connectOrCreate: expenseFormValues.documents.map((doc) => ({
          create: doc,
          where: { id: doc.id },
        })),
        deleteMany: existingExpense.documents
          .filter(
            (existingDoc) =>
              !expenseFormValues.documents.some(
                (doc) => doc.id === existingDoc.id,
              ),
          )
          .map((doc) => ({
            id: doc.id,
          })),
      },
      notes: expenseFormValues.notes,
      location: {
        delete: !!existingExpense.location && !expenseFormValues.location,
        ...(expenseFormValues.location && {
          upsert: {
            create: { ...expenseFormValues.location },
            update: { ...expenseFormValues.location },
          },
        }),
      },
    },
  })
}

export async function getComments(
  expenseId: string,
  options?: { offset?: number; length?: number },
) {
  return prisma.expenseComment.findMany({
    where: { expenseId: expenseId },
    include: { participant: true },
    orderBy: [{ time: 'desc' }],
    skip: options && options.offset,
    take: options && options.length,
  })
}

export async function getComment(commentId: string) {
  return prisma.expenseComment.findUnique({
    where: { id: commentId },
    include: { participant: true },
  })
}

export async function addComment(
  expenseId: string,
  participantId: string,
  comment: string,
): Promise<ExpenseComment> {
  return prisma.expenseComment.create({
    data: {
      id: randomId(),
      comment: comment,
      participantId: participantId,
      expenseId: expenseId,
    },
  })
}

export async function updateComment(commentId: string, comment: string) {
  const existingComment = await getComment(commentId)
  if (!existingComment) throw new Error('Invalid Comment ID')

  return prisma.expenseComment.update({
    where: { id: commentId },
    data: {
      comment: comment,
    },
  })
}

export async function deleteComment(commentId: string) {
  await prisma.expenseComment.delete({
    where: { id: commentId },
  })
}

export async function updateGroup(
  groupId: string,
  groupFormValues: GroupFormValues,
  participantId?: string,
) {
  const existingGroup = await getGroup(groupId)
  if (!existingGroup) throw new Error('Invalid group ID')

  await logActivity(groupId, ActivityType.UPDATE_GROUP, { participantId })

  return prisma.group.update({
    where: { id: groupId },
    data: {
      name: groupFormValues.name,
      information: groupFormValues.information,
      currency: groupFormValues.currency,
      participants: {
        deleteMany: existingGroup.participants.filter(
          (p) => !groupFormValues.participants.some((p2) => p2.id === p.id),
        ),
        updateMany: groupFormValues.participants
          .filter((participant) => participant.id !== undefined)
          .map((participant) => ({
            where: { id: participant.id },
            data: {
              name: participant.name,
            },
          })),
        createMany: {
          data: groupFormValues.participants
            .filter((participant) => participant.id === undefined)
            .map((participant) => ({
              id: randomId(),
              name: participant.name,
            })),
        },
      },
    },
  })
}

export async function getGroup(groupId: string) {
  return prisma.group.findUnique({
    where: { id: groupId },
    include: { participants: true },
  })
}

export async function getCategories() {
  return prisma.category.findMany()
}

export async function getGroupExpenses(
  groupId: string,
  options?: { offset?: number; length?: number; filter?: string },
) {
  
  return prisma.expense.findMany({
    select: {
      amount: true,
      category: true,
      createdAt: true,
      expenseDate: true,
      id: true,
      isReimbursement: true,
      paidBy: { select: { id: true, name: true } },
      paidFor: {
        select: {
          participant: { select: { id: true, name: true } },
          shares: true,
        },
      },
      splitMode: true,
      title: true,
      _count: { select: { documents: true } },
    },
    where: {
      groupId,
      title: options?.filter
        ? { contains: options.filter, mode: 'insensitive' }
        : undefined,
    },
    orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
    skip: options && options.offset,
    take: options && options.length,
  })
}

export async function getGroupExpenseCount(groupId: string) {
  return prisma.expense.count({ where: { groupId } })
}

export async function getExpense(groupId: string, expenseId: string) {
  return prisma.expense.findUnique({
    where: { id: expenseId },
    include: {
      paidBy: true,
      paidFor: true,
      category: true,
      documents: true,
      location: true,
    },
  })
}

export async function getActivities(
  groupId: string,
  options?: { offset?: number; length?: number },
) {
  const activities = await prisma.activity.findMany({
    where: { groupId },
    orderBy: [{ time: 'desc' }],
    skip: options?.offset,
    take: options?.length,
  })

  const expenseIds = activities
    .map((activity) => activity.expenseId)
    .filter(Boolean)
  const expenses = await prisma.expense.findMany({
    where: {
      groupId,
      id: { in: expenseIds },
    },
  })

  return activities.map((activity) => ({
    ...activity,
    expense:
      activity.expenseId !== null
        ? expenses.find((expense) => expense.id === activity.expenseId)
        : undefined,
  }))
}

export async function getExpenseActivity(expenseId: string) {
  return prisma.activity.findMany({
    where: { expenseId: expenseId },
    orderBy: [{ time: 'desc' }],
  })
}

export async function logActivity(
  groupId: string,
  activityType: ActivityType,
  extra?: { participantId?: string; expenseId?: string; data?: string },
) {
  sendActivityEmails(
    groupId,
    activityType,
    extra?.participantId,
    extra?.expenseId,
    extra?.data,
  )
  return prisma.activity.create({
    data: {
      id: randomId(),
      groupId,
      activityType,
      ...extra,
    },
  })
}

export async function createFriend(friendFormSchema: GroupFormValues) {
  
  const loggedInUser = await prisma.user.findUnique({
    where: { email: friendFormSchema.loggedInEmail },
    select: { id: true, name: true },
  })

  let newFriend = await prisma.user.findUnique({
    where: { email: friendFormSchema.friendEmail || "" },
  });

  if(!newFriend){
    newFriend = await prisma.user.create({
      data: {
        id: randomId(),
        name: friendFormSchema.name,
        email: friendFormSchema.friendEmail || "",
      },
    });
  }

  // Step 2: Create a new Group with type 'dualMember'
  const newGroup = await prisma.group.create({
    data: {
      id: randomId(),
      type: "DUAL_MEMBER", // Setting the group type as dualMember
      name: "Friend_Group", // Setting the group name as friendGroup
      information: friendFormSchema.information,
      currency: friendFormSchema.currency,
      participants: {
        createMany: {
          data: [
            { id: randomId(), name: loggedInUser?.name || "", userId: loggedInUser?.id }, // Logged-in user
            { id: randomId(), name: newFriend.name, userId: newFriend.id }, // Newly created friend user
          ],
        },
      },
    },
    include: { participants: true },
  });

  // Set the name based on the alternate participant
  const alternateParticipant = newGroup.participants.find((p) => p.userId !== loggedInUser?.id);

  // update newfriend's recent friend table to add extising logged user
  await prisma.recentFriend.upsert({
    where: { userId_groupId: { groupId: newGroup.id, userId: newFriend.id } },
    update: { name: loggedInUser?.name },
    create: { groupId: newGroup.id, name: loggedInUser?.name || "", userId: newFriend.id },
  }) 

  return {
    ...newGroup,
    name: alternateParticipant ? alternateParticipant.name : "Unknown",
    friendEmail: friendFormSchema.friendEmail || "unknown@liveonsplit.com",
  };
}

export async function listFriends(loggedInUserId: string) {
  // Fetch all DUAL_MEMBER groups where the logged-in user is a participant
  const groups = await prisma.group.findMany({
    where: {
      type: "DUAL_MEMBER",
      participants: {
        some: {
          userId: loggedInUserId,
        },
      },
    },
    include: { participants: true },
  });

  // Map the groups to dynamically set the name based on logged-in user
  return groups.map((group) => {
    const alternateParticipant = group.participants.find((p) => p.userId !== loggedInUserId);
    return {
      ...group,
      name: alternateParticipant ? alternateParticipant.name : "Unknown",
    };
  });
}

export async function getFriend(loggedInUserEmail: string, groupId: string) {

  const loggedInUser = await prisma.user.findUnique({
    where: { email: loggedInUserEmail },
    select: { id: true, name: true },
  })

  // Fetch the specific DUAL_MEMBER group where the logged-in user is a participant
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
      type: "DUAL_MEMBER",
      participants: {
        some: {
          userId: loggedInUser?.id,
        },
      },
    },
    include: { participants: true },
  });

  if (!group) {
    return null;
  }

  // Set the name based on the alternate participant
  const alternateParticipant = group.participants.find((p) => p.userId !== loggedInUser?.id);
  const user = await prisma.user.findUnique({
    where: { id: alternateParticipant?.userId || "Unknown" },
    select: { email: true },
  })
  return {
    ...group,
    name: alternateParticipant ? alternateParticipant.name : "Unknown",
    friendEmail: user?.email || "unknown@liveonsplit.com",
  };
}


export async function getLoggedUserParticipantId(groupId: string, 
  loggedUserEmail: string): Promise<string | null> {
  try {
    const participant = await prisma.participant.findFirst({
      where: {
        groupId: groupId,
        user: {
          email: loggedUserEmail,
        },
      },
      select: {
        id: true,
      },
    });

    return participant ? participant.id : null;
  } catch (error) {
    console.error("Error fetching participantId:", error);
    return null;
  }
}

export async function getGroupExpensesByParticipant(groupId: string) {
  const expensesByParticipant = await prisma.expense.groupBy({
    by: ['paidById'],
    where: {
      groupId,
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: { amount: 'desc' },
    },
  })

  const group = await getGroup(groupId)
  return expensesByParticipant.map((expense) => {
    return {
      participant: group!.participants.find((p) => p.id === expense.paidById)
        ?.name,
      amount: expense._sum.amount ?? 0 / 100.0,
    }
  })
}

export async function getGroupExpensesByCategory(groupId: string) {
  const expensesByCategory = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: {
      groupId,
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: { amount: 'desc' },
    },
  })

  const categories = await getCategories()
  return expensesByCategory.map((expenseCategory) => {
    return {
      category: categories.find((c) => c.id === expenseCategory.categoryId)
        ?.name,
      amount: expenseCategory._sum.amount ?? 0 / 100.0,
    }
  })
}
