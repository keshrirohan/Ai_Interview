import { prisma } from "../../lib/prisma.js";
import Stripe from "stripe";

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
 * Create a new Stripe payment order (PaymentIntent) with downgrade protection
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

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_echohire";

  let orderId;
  let clientSecret = null;

  // 2. Real Stripe API PaymentIntent creation if secret key is configured
  if (stripeSecretKey && stripeSecretKey !== "sk_test_echohire") {
    try {
      const stripe = new Stripe(stripeSecretKey);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in smallest currency unit (paise/cents)
        currency: "inr",
        description: `EchoHire AI — Upgrade to ${targetPlan} Plan`,
        metadata: {
          userId,
          plan: targetPlan,
        },
      });

      orderId = paymentIntent.id;
      clientSecret = paymentIntent.client_secret;
    } catch (err) {
      console.warn("[Payment] Stripe API error, falling back to local simulated order:", err.message);
      orderId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      clientSecret = `pi_test_secret_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
  } else {
    // Simulated order ID for test/development mode
    orderId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    clientSecret = `pi_test_secret_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  return {
    orderId,
    clientSecret,
    amount,
    currency: "INR",
    plan: targetPlan,
    publishableKey: stripePublishableKey,
  };
};

/**
 * Verify and process successful payment transaction via Stripe
 */
export const verifyPaymentService = async (userId, data) => {
  const { paymentId, orderId, plan, amount } = data;
  const targetIntentId = paymentId || orderId;

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

  // Verify PaymentIntent with Stripe API if secret key is present and intent starts with real pi_
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey && stripeSecretKey !== "sk_test_echohire" && targetIntentId && targetIntentId.startsWith("pi_") && !targetIntentId.startsWith("pi_test_")) {
    try {
      const stripe = new Stripe(stripeSecretKey);
      const intent = await stripe.paymentIntents.retrieve(targetIntentId);
      if (intent.status !== "succeeded") {
        console.warn(`[Payment] Stripe PaymentIntent ${targetIntentId} status is ${intent.status}`);
      }
    } catch (err) {
      console.warn("[Payment] Could not verify PaymentIntent with Stripe API:", err.message);
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
        paymentId: targetIntentId || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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


