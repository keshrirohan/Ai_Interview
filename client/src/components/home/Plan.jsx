import { useState } from "react";
import PlanCard from "./PlanCard";
import PaymentModal from "../payment/PaymentModal";
import { useAuth } from "../../context/AuthContext";

const plans = [
  {
    title: "Free",
    planKey: "FREE",
    price: "₹0",
    duration: "/forever",
    popular: false,
    features: [
      "20 AI Interviews",
      "Basic AI Evaluation",
      "Interview History",
      "Standard Analytics",
    ],
  },
  {
    title: "Gold",
    planKey: "GOLD",
    price: "₹499",
    duration: "/year",
    popular: true,
    features: [
      "50 AI Interviews",
      "Full AI Model Expected Answers",
      "Detailed Competency Analytics",
      "Export Performance Reports",
      "Priority AI Response",
    ],
  },
  {
    title: "Platinum",
    planKey: "PLATINUM",
    price: "₹999",
    duration: "/year",
    popular: false,
    features: [
      "100 AI Interviews",
      "Full AI Model Expected Answers",
      "Advanced Skill Analytics & Trends",
      "Custom Job Description Targeting",
      "24/7 Priority Support",
    ],
  },
];

const PLAN_RANKS = { FREE: 0, GOLD: 1, PLATINUM: 2 };

const Plan = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const userRank = PLAN_RANKS[user?.plan || "FREE"] ?? 0;

  return (
    <section className="w-full bg-zinc-50 py-20 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Flexible Subscription Plans
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Choose the plan that fits your career goals and unlock full AI model answers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const cardRank = PLAN_RANKS[plan.planKey] ?? 0;
            return (
              <PlanCard
                key={plan.title}
                {...plan}
                currentPlan={user?.plan}
                onSelect={() => {
                  if (cardRank > userRank) {
                    setSelectedPlan(plan.planKey);
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      <PaymentModal
        isOpen={Boolean(selectedPlan)}
        planName={selectedPlan || "GOLD"}
        onClose={() => setSelectedPlan(null)}
      />
    </section>
  );
};

export default Plan;
