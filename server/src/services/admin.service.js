import { prisma } from "../../lib/prisma.js";

// Overview Analytics
export const getAdminOverviewStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalInterviews = await prisma.interview.count();
  const completedInterviews = await prisma.interview.count({
    where: { status: "COMPLETED" },
  });

  const totalPayments = await prisma.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amount: true },
    _count: { id: true },
  });

  const planBreakdown = await prisma.user.groupBy({
    by: ["plan"],
    _count: { id: true },
  });

  const unreadMessages = await prisma.contactMessage.count({
    where: { status: "UNREAD" },
  });

  return {
    totalUsers,
    totalInterviews,
    completedInterviews,
    totalRevenue: totalPayments._sum.amount || 0,
    totalTransactions: totalPayments._count.id || 0,
    unreadMessages,
    planBreakdown: planBreakdown.reduce((acc, curr) => {
      acc[curr.plan] = curr._count.id;
      return acc;
    }, {}),
  };
};

// User Management
export const getAllUsersService = async (search = "") => {
  return await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      interviewsUsed: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateUserPlanService = async (userId, plan) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });
};

export const updateUserRoleService = async (userId, role) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

export const deleteUserService = async (userId) => {
  // Delete cascade relations if needed, then user
  await prisma.interview.deleteMany({ where: { userId } });
  await prisma.payment.deleteMany({ where: { userId } });
  await prisma.contactMessage.deleteMany({ where: { userId } });
  await prisma.subscription.deleteMany({ where: { userId } });

  return await prisma.user.delete({
    where: { id: userId },
  });
};

// Contact Inbox Management
export const getContactMessagesService = async () => {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

export const updateContactStatusService = async (id, status) => {
  return await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
};

export const deleteContactMessageService = async (id) => {
  return await prisma.contactMessage.delete({
    where: { id },
  });
};

// System-wide Interviews
export const getAllSystemInterviewsService = async () => {
  return await prisma.interview.findMany({
    orderBy: { startedAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
      report: true,
    },
  });
};

// System Payments
export const getAllSystemPaymentsService = async () => {
  return await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true, plan: true } },
    },
  });
};
