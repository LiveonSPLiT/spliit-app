import { prisma } from '@/lib/prisma'
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
} from 'date-fns'

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
}

export async function getTotalSpendings(email: string) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('User not found')

  const totalSpendings = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: { paidBy: { userId: user.id } },
  })

  return totalSpendings._sum.amount || 0
}

export async function getTotalSpendingsCurrentMonth(email: string) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('User not found')

  const totalSpendings = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      paidBy: { userId: user.id },
      expenseDate: {
        gte: startOfMonth(new Date()),
        lte: endOfMonth(new Date()),
      },
    },
  })

  return totalSpendings._sum.amount || 0
}

export async function getTotalGroupSpendings(email: string) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('User not found')

  const totalSpendings = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      paidBy: { userId: user.id },
      group: { type: 'MULTI_MEMBER' },
    },
  })

  return totalSpendings._sum.amount || 0
}

export async function getTotalFriendSpendings(email: string) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('User not found')

  const totalSpendings = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      paidBy: { userId: user.id },
      group: { type: 'DUAL_MEMBER' },
    },
  })

  return totalSpendings._sum.amount || 0
}

export async function getMonthlySpendingData(email: string) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('User not found')

  const currentYear = new Date().getFullYear()
  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(currentYear, i, 1), 'MMM'),
  )

  // Fetch expenses grouped by year-month
  const expenses = await prisma.expense.groupBy({
    by: ['groupId', 'expenseDate'],
    _sum: { amount: true },
    where: {
      paidBy: { userId: user.id },
      expenseDate: { gte: startOfYear(new Date()), lte: endOfYear(new Date()) },
    },
    orderBy: { expenseDate: 'asc' },
  })

  // Aggregate amounts by month
  const spendingData = expenses.reduce((acc, exp) => {
    const month = format(exp.expenseDate, 'MMM') // Convert date to month (e.g., "Jan")
    acc[month] = (acc[month] || 0) + (exp._sum.amount || 0) / 100
    return acc
  }, {} as Record<string, number>)

  // Return monthly data
  return months.map((month) => ({
    month,
    total: spendingData[month] || 0,
  }))
}

export async function getGroupWiseSpendingData(email: string) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('User not found')

  const expenses = await prisma.expense.groupBy({
    by: ['groupId'],
    _sum: { amount: true },
    where: { paidBy: { userId: user.id }, group: { type: 'MULTI_MEMBER' } },
  })

  const groupDetails = await prisma.group.findMany({
    where: { id: { in: expenses.map((exp) => exp.groupId) } },
    select: { id: true, name: true },
  })

  return expenses.map((exp) => ({
    groupName:
      groupDetails.find((g) => g.id === exp.groupId)?.name || 'Unknown Group',
    total: exp._sum.amount || 0,
  }))
}

export async function getFriendWiseSpendingData(email: string) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('User not found')

  const friendExpenses = await prisma.expense.groupBy({
    by: ['groupId'],
    _sum: { amount: true },
    where: { paidBy: { userId: user.id }, group: { type: 'DUAL_MEMBER' } },
  })

  const friendGroups = await prisma.group.findMany({
    where: { id: { in: friendExpenses.map((exp) => exp.groupId) } },
    select: {
      id: true,
      participants: { select: { userId: true, name: true } },
    },
  })

  return friendExpenses.map((exp) => {
    const group = friendGroups.find((g) => g.id === exp.groupId)
    const alternateParticipant = group?.participants.find(
      (p) => p.userId !== user.id,
    )

    return {
      friendName: alternateParticipant ? alternateParticipant.name : 'Someone',
      total: exp._sum.amount || 0,
    }
  })
}

export async function getCategoryWiseSpendingData(email: string) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('User not found')

  const expenses = await prisma.expense.groupBy({
    by: ['categoryId'],
    _sum: { amount: true },
    where: { paidBy: { userId: user.id } },
  })

  return expenses.map((exp) => ({
    categoryId: exp.categoryId,
    total: exp._sum.amount || 0,
  }))
}
