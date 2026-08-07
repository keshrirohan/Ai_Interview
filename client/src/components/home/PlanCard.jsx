import { Check } from "lucide-react";

const PLAN_RANKS = {
  FREE: 0,
  GOLD: 1,
  PLATINUM: 2,
};

const PlanCard = ({
  title,
  planKey,
  price,
  duration,
  features,
  popular = false,
  currentPlan = "FREE",
  onSelect,
}) => {
  const userRank = PLAN_RANKS[currentPlan] ?? 0;
  const cardRank = PLAN_RANKS[planKey] ?? 0;

  const isCurrent = cardRank === userRank;
  const isLowerTier = cardRank < userRank;
  const isUpgradeable = cardRank > userRank;

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
      ${
        popular
          ? "scale-105 border-blue-600 bg-blue-600 text-white shadow-blue-500/30 shadow-2xl"
          : "border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
      }`}
    >
      {/* Popular Badge */}
      {popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-black">
          ⭐ Most Popular
        </span>
      )}

      {/* Plan Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {isCurrent && (
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            Active Plan
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-5 flex items-end gap-1">
        <span className="text-5xl font-extrabold">{price}</span>
        <span
          className={`mb-1 ${
            popular ? "text-blue-100" : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {duration}
        </span>
      </div>

      {/* Features */}
      <ul className="mt-8 flex-1 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check
              size={18}
              className={popular ? "text-white" : "text-green-500"}
            />
            <span
              className={
                popular
                  ? "text-blue-50"
                  : "text-zinc-600 dark:text-zinc-300"
              }
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <button
        onClick={onSelect}
        disabled={!isUpgradeable}
        className={`mt-10 w-full rounded-xl py-3.5 font-semibold transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed
        ${
          popular
            ? "bg-white text-blue-600 hover:bg-zinc-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isCurrent
          ? "Active Plan"
          : isLowerTier
          ? "Included in Your Plan"
          : `Upgrade to ${title}`}
      </button>
    </div>
  );
};

export default PlanCard;