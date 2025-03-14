import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth } from "date-fns";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
}

export async function getTotalSpendings(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const totalSpendings = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: { paidBy: { userId: user.id } },
  });

  return totalSpendings._sum.amount || 0;
}

export async function getTotalSpendingsCurrentMonth(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const totalSpendings = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      paidBy: { userId: user.id },
      expenseDate: { gte: startOfMonth(new Date()), lte: endOfMonth(new Date()) },
    },
  });

  return totalSpendings._sum.amount || 0;
}

export async function getTotalGroupSpendings(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const totalSpendings = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      paidBy: { userId: user.id },
      group: { type: "MULTI_MEMBER" },
    },
  });

  return totalSpendings._sum.amount || 0;
}

export async function getTotalFriendSpendings(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const totalSpendings = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      paidBy: { userId: user.id },
      group: { type: "DUAL_MEMBER" },
    },
  });

  return totalSpendings._sum.amount || 0;
}

export async function getMonthlySpendingData(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const expenses = await prisma.expense.groupBy({
    by: ["expenseDate"],
    _sum: { amount: true },
    where: { paidBy: { userId: user.id } },
    orderBy: { expenseDate: "asc" },
  });

  return expenses.map((exp) => ({
    month: exp.expenseDate.toISOString().slice(0, 7),
    total: exp._sum.amount || 0,
  }));
}

export async function getGroupWiseSpendingData(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const expenses = await prisma.expense.groupBy({
    by: ["groupId"],
    _sum: { amount: true },
    where: { paidBy: { userId: user.id }, group: { type: "MULTI_MEMBER" } },
  });

  const groupDetails = await prisma.group.findMany({
    where: { id: { in: expenses.map(exp => exp.groupId) } },
    select: { id: true, name: true },
  });

  return expenses.map((exp) => ({
    groupName: groupDetails.find(g => g.id === exp.groupId)?.name || "Unknown Group",
    total: exp._sum.amount || 0,
  }));
}

export async function getFriendWiseSpendingData(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const expenses = await prisma.expense.groupBy({
    by: ["groupId"],
    _sum: { amount: true },
    where: { paidBy: { userId: user.id }, group: { type: "DUAL_MEMBER" } },
  });

  const friendDetails = await prisma.group.findMany({
    where: { id: { in: expenses.map(exp => exp.groupId) } },
    select: { id: true, name: true },
  });

  return expenses.map((exp) => ({
    friendName: friendDetails.find(f => f.id === exp.groupId)?.name || "Unknown Friend",
    total: exp._sum.amount || 0,
  }));
}

export async function getCategoryWiseSpendingData(email: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const expenses = await prisma.expense.groupBy({
    by: ["categoryId"],
    _sum: { amount: true },
    where: { paidBy: { userId: user.id } },
  });

  return expenses.map((exp) => ({ categoryId: exp.categoryId, total: exp._sum.amount || 0 }));
}
