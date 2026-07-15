import PlanCard from "./PlanCard";

const plans = [
  {
    title: "Free",
    price: "$0",
    duration: "/month",
    popular: false,
    features: [
      "20 AI Interviews",
      "Basic AI Feedback",
      "Interview History",
      "Email Support",
    ],
  },
  {
    title: "Pro",
    price: "$19",
    duration: "/month",
    popular: true,
    features: [
      "Unlimited AI Interviews",
      "Advanced AI Feedback",
      "Resume Analysis",
      "Performance Analytics",
      "Priority Support",
    ],
  },
  {
    title: "Enterprise",
    price: "$49",
    duration: "/month",
    popular: false,
    features: [
      "Unlimited Team Members",
      "Custom AI Models",
      "Dedicated Manager",
      "API Access",
      "24/7 Premium Support",
    ],
  },
];

const Plan = () => {
  return (
    <section className="w-full bg-zinc-50 py-20 transition-colors duration-300 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Simple Pricing
          </h2>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Choose the perfect plan to level up your interview preparation.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.title} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plan;
