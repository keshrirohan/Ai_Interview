import { prisma } from "../../lib/prisma.js";
import crypto from "crypto";

// Plan hierarchy ranking
export const PLAN_RANKS = {
  FREE: 0,
  GOLD: 1,
  PLATINUM: 2,
};

// Prices in INR
const PLAN_PRICES = {
  GOLD: 499,     // ₹499
  PLATINUM: 999, // ₹999
};

/**
 * Create a new payment order with downgrade protection
 */
export const createOrderService = async (userId, plan) => {
  const targetPlan = plan?.toUpperCase();
  const amount = PLAN_PRICES[targetPlan];
  if (!amount) {
    throw new Error("Invalid subscription plan selected.");
  }

  // 1. Fetch current user plan to enforce upgrade-only constraint
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const userRank = PLAN_RANKS[user.plan] ?? 0;
  const targetRank = PLAN_RANKS[targetPlan] ?? 0;

  if (targetRank <= userRank) {
    throw new Error(
      `Downgrade or re-subscribing to your current plan is not allowed. You are currently on ${user.plan} Plan and can only upgrade to a higher tier.`
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  let orderId;

  // 2. Real Razorpay API Order Creation if credentials are configured
  if (keyId && keySecret && keyId !== "rzp_test_echohire") {
    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}_${userId.slice(-4)}`,
          notes: { userId, plan: targetPlan },
        }),
      });

      const rzpOrder = await response.json();
      if (!response.ok) {
        throw new Error(rzpOrder.error?.description || "Razorpay API error.");
      }
      orderId = rzpOrder.id;
    } catch (err) {
      console.warn("[Payment] Razorpay REST API error, falling back to local order ID:", err.message);
      orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
  } else {
    // Simulated order ID for test/development mode
    orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  return {
    orderId,
    amount,
    currency: "INR",
    plan: targetPlan,
    keyId: keyId || "rzp_test_echohire",
  };
};

/**
 * Verify and process successful payment transaction
 */
export const verifyPaymentService = async (userId, data) => {
  const { paymentId, orderId, signature, plan, amount } = data;

  const validPlan = plan && ["GOLD", "PLATINUM"].includes(plan.toUpperCase()) ? plan.toUpperCase() : "GOLD";
  const targetRank = PLAN_RANKS[validPlan] ?? 0;

  // Enforce upgrade-only rule on verification
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, plan: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const userRank = PLAN_RANKS[user.plan] ?? 0;
  if (targetRank <= userRank) {
    throw new Error(`Cannot downgrade or re-subscribe to your current (${user.plan}) plan.`);
  }

  // Verify HMAC signature if Razorpay Secret is provided and signature was sent
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keySecret && signature && orderId) {
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new Error("Payment signature verification failed. Invalid transaction token.");
    }
  }

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

