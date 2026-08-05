import { prisma } from "../../lib/prisma.js";

// Prices in INR
const PLAN_PRICES = {
  GOLD: 499,     // ₹499
  PLATINUM: 999, // ₹999
};

/**
 * Create a new payment order
 */
export const createOrderService = async (userId, plan) => {
  const amount = PLAN_PRICES[plan];
  if (!amount) {
    throw new Error("Invalid subscription plan selected.");
  }

  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    orderId,
    amount,
    currency: "INR",
    plan,
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_echohire",
  };
};

/**
 * Verify and process successful payment transaction
 */
export const verifyPaymentService = async (userId, data) => {
  const { paymentId, orderId, plan, amount } = data;

  const validPlan = plan && ["GOLD", "PLATINUM"].includes(plan) ? plan : "GOLD";
  const paidAmount = amount || PLAN_PRICES[validPlan] || 499;

  // Execute database updates in an atomic transaction
  const [payment, updatedUser, subscription] = await prisma.$transaction([
    // 1. Log Payment
    prisma.payment.create({
      data: {
        userId,
        amount: paidAmount,
        status: "SUCCESS",
        paymentId: paymentId || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      },
    }),

    // 2. Upgrade User Plan
    prisma.user.update({
      where: { id: userId },
      data: { plan: validPlan },
    }),

    // 3. Create or Update Subscription record
    prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: validPlan,
        active: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
      create: {
        userId,
        plan: validPlan,
        active: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  return {
    payment,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      plan: updatedUser.plan,
    },
    subscription,
  };
};

/**
 * Fetch payment transaction history for a user
 */
export const getPaymentHistoryService = async (userId) => {
  return await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
