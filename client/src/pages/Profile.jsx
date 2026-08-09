import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Layers,
  Lightbulb,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User as UserIcon,
  X,
  Zap,
  HelpCircle,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";
import PaymentModal from "../components/payment/PaymentModal";

// ─── Graph 1: Performance Trend Line & Area Chart ───────────────────────────
const PerformanceTrendChart = ({ interviews }) => {
  const completed = (interviews || [])
    .filter((i) => i.report && i.report.score !== null)
    .reverse(); // oldest first

  if (completed.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-zinc-400">
        No completed interviews yet to render performance trend line graph.
      </div>
    );
  }

  const width = 600;
  const height = 200;
  const padding = 40;

  const points = completed.map((item, index) => {
    const x =
      completed.length === 1
        ? width / 2
        : padding + (index * (width - padding * 2)) / (completed.length - 1);
    const score = item.report.score;
    const y = height - padding - (score / 10) * (height - padding * 2);
    return { x, y, score, date: new Date(item.startedAt).toLocaleDateString() };
  });

  const pathD =
    points.length === 1
      ? `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y}`
      : points.reduce((acc, point, i) => {
          return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
        }, "");

  const areaD =
    points.length === 1
      ? ""
      : `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines */}
        {[0, 2.5, 5, 7.5, 10].map((val) => {
          const y = height - padding - (val / 10) * (height - padding * 2);
          return (
            <g key={val}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e4e4e7"
                strokeDasharray="4 4"
                className="dark:stroke-zinc-800"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] font-medium fill-zinc-400"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill under curve */}
        {areaD && <path d={areaD} fill="url(#trendGradient)" />}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots & Labels */}
        {points.map((pt, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={pt.x}
              cy={pt.y}
              r="6"
              fill="#3b82f6"
              className="transition-all duration-200 group-hover:r-8 stroke-white dark:stroke-zinc-900 stroke-2"
            />
            <text
              x={pt.x}
              y={pt.y - 12}
              textAnchor="middle"
              className="text-[11px] font-bold fill-zinc-900 dark:fill-white"
            >
              {pt.score}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─── Graph 2: Competency Breakdown Bar Chart ───────────────────────────────
const CompetencyRadarChart = ({ stats }) => {
  const metrics = [
    { label: "Technical Competency", score: stats.averageTechnical || 0, color: "#3b82f6" },
    { label: "Communication Skill", score: stats.averageCommunication || 0, color: "#a855f7" },
    { label: "Problem Solving", score: stats.averageProblemSolving || 0, color: "#f59e0b" },
    { label: "Confidence Level", score: stats.averageConfidence || 0, color: "#10b981" },
  ];

  return (
    <div className="space-y-4">
      {metrics.map((m) => (
        <div key={m.label} className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.label}
            </span>
            <span className="font-bold">{m.score} / 10</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(m.score / 10) * 100}%`,
                backgroundColor: m.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Graph 3: Difficulty Breakdown Chart ────────────────────────────────────
const DifficultyBreakdownChart = ({ interviews }) => {
  const counts = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const scores = { EASY: [], MEDIUM: [], HARD: [] };

  (interviews || []).forEach((item) => {
    if (counts[item.difficulty] !== undefined) {
      counts[item.difficulty]++;
      if (item.report && item.report.score) {
        scores[item.difficulty].push(item.report.score);
      }
    }
  });

  const getAvg = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;

  const diffs = [
    { label: "Easy", count: counts.EASY, avg: getAvg(scores.EASY), color: "bg-emerald-500" },
    { label: "Medium", count: counts.MEDIUM, avg: getAvg(scores.MEDIUM), color: "bg-amber-500" },
    { label: "Hard", count: counts.HARD, avg: getAvg(scores.HARD), color: "bg-rose-500" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {diffs.map((d) => (
        <div
          key={d.label}
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${d.color}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              {d.label} Difficulty
            </span>
          </div>
          <h4 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {d.avg} <span className="text-xs font-normal text-zinc-400">avg score</span>
          </h4>
          <p className="mt-1 text-xs text-zinc-500">{d.count} session(s)</p>
        </div>
      ))}
    </div>
  );
};

// ─── Graph 4: Question-by-Question Score Bar Chart ──────────────────────────
const QuestionScoresBarChart = ({ conversation }) => {
  if (!Array.isArray(conversation) || conversation.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Question Score Breakdown Graph
      </h4>
      <div className="flex h-36 items-end gap-3 px-2">
        {conversation.map((qa, index) => {
          const score = qa.score || 0;
          const heightPct = Math.max(10, (score / 10) * 100);
          return (
            <div
              key={index}
              className="group relative flex flex-1 flex-col items-center gap-2"
            >
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {score}
              </span>
              <div className="flex h-full w-full max-w-[40px] items-end rounded-t-lg bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="w-full rounded-t-lg bg-blue-600 transition-all duration-500 group-hover:bg-blue-500"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-zinc-500">
                Q{index + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Profile Component ──────────────────────────────────────────────────
const Profile = () => {
  const { user: authUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Selected Modal
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [paymentModalPlan, setPaymentModalPlan] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard`,
          { credentials: "include", headers }
        );
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load profile dashboard.");
        }
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
          <p className="font-semibold">Unable to load dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
      </div>
    );
  }

  const { user, stats, overallReport, interviews } = data;

  // Filtered interviews
  const filteredInterviews = (interviews || []).filter((item) => {
    const matchesSearch =
      item.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.id && item.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    const matchesDifficulty =
      difficultyFilter === "ALL" || item.difficulty === difficultyFilter;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const getScoreColor = (score) => {
    if (score === null || score === undefined)
      return "text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400";
    if (score >= 8)
      return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400";
    if (score >= 6)
      return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400";
    return "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400";
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case "EASY":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "HARD":
        return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  const parseJson = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [val];
      }
    }
    return [];
  };

  const usagePercentage = Math.min(
    100,
    Math.round((stats.interviewsUsed / (stats.limit || 20)) * 100)
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-24 sm:px-6 lg:px-8">
      {/* ── Header Card ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
                  {user.name}
                </h1>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  {stats.plan} PLAN
                </span>
                {stats.plan === "FREE" && (
                  <button
                    onClick={() => setPaymentModalPlan("GOLD")}
                    className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-3.5 py-1 text-xs font-bold text-black shadow-sm transition hover:scale-105"
                  >
                    <Zap size={13} /> Upgrade to Gold
                  </button>
                )}
                {stats.plan === "GOLD" && (
                  <button
                    onClick={() => setPaymentModalPlan("PLATINUM")}
                    className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 px-3.5 py-1 text-xs font-bold text-white shadow-sm transition hover:scale-105"
                  >
                    <Zap size={13} /> Upgrade to Platinum
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Activity size={14} /> {stats.totalCompletedInterviews}{" "}
                  Sessions Completed
                </span>
              </div>
            </div>
          </div>

          {/* Usage Meter Card */}
          <div className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-5 md:w-80 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <span>Interview Quota</span>
              <span>
                {stats.interviewsUsed} / {stats.limit} Used
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs text-zinc-400">
              {stats.remainingInterviews} remaining
            </p>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Overview ───────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total Sessions
            </span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FileText size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
            {stats.totalInterviews}
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {stats.totalCompletedInterviews} Completed
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Average Score
            </span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
            {stats.averageScore}{" "}
            <span className="text-sm font-normal text-zinc-400">/ 10</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Best score: {stats.bestScore}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Technical Depth
            </span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Zap size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
            {stats.averageTechnical}{" "}
            <span className="text-sm font-normal text-zinc-400">/ 10</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Domain competency
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Communication
            </span>
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Sparkles size={20} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
            {stats.averageCommunication}{" "}
            <span className="text-sm font-normal text-zinc-400">/ 10</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Clarity & structure
          </p>
        </div>
      </div>

      {/* ── Visual Analytics Graphs Section ─────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Graph 1: Performance Trend Line Chart */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white">
                <TrendingUp size={18} className="text-blue-500" /> Session Score Trend Graph
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Score progression across completed interview sessions
              </p>
            </div>
          </div>
          <PerformanceTrendChart interviews={interviews} />
        </div>

        {/* Graph 2: Competency Breakdown Bar Graph */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white">
                <BarChart3 size={18} className="text-purple-500" /> Skill Competency Breakdown
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Visual evaluation across technical, communication & confidence
              </p>
            </div>
          </div>
          <CompetencyRadarChart stats={stats} />
        </div>
      </div>

      {/* Graph 3: Difficulty Breakdown Chart */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white">
            <Layers size={18} className="text-amber-500" /> Performance by Difficulty Graph
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Average score achieved on Easy, Medium, and Hard difficulty interviews
          </p>
        </div>
        <DifficultyBreakdownChart interviews={interviews} />
      </div>

      {/* ── Overall Performance Analysis Report ───────────────────────── */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={22} />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Overall AI Performance Report
              </h2>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Aggregated AI analytics across all your completed interview sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
            <Star size={16} className="fill-blue-500 text-blue-500" />
            Overall Rating: {overallReport.overallScore} / 10
          </div>
        </div>

        {/* Executive Summary */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Executive Summary
          </h3>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {overallReport.summary}
          </p>
        </div>

        {/* Strengths, Weaknesses, Recommendations Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Strengths */}
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/30 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 size={16} /> Key Strengths
            </h4>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-emerald-900 dark:text-emerald-200">
              {overallReport.strengths && overallReport.strengths.length > 0 ? (
                overallReport.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500 dark:text-zinc-400">
                  Complete more sessions to identify key strengths.
                </li>
              )}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/30 p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
            <h4 className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
              <AlertTriangle size={16} /> Focus Areas
            </h4>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              {overallReport.weaknesses && overallReport.weaknesses.length > 0 ? (
                overallReport.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{weak}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500 dark:text-zinc-400">
                  No critical focus areas identified yet.
                </li>
              )}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl border border-blue-200/60 bg-blue-50/30 p-5 dark:border-blue-900/30 dark:bg-blue-950/20">
            <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 dark:text-blue-300">
              <Lightbulb size={16} /> Action Items
            </h4>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-blue-900 dark:text-blue-200">
              {overallReport.recommendations &&
              overallReport.recommendations.length > 0 ? (
                overallReport.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))
              ) : (
                <li className="text-zinc-500 dark:text-zinc-400">
                  Recommendations will appear after your interviews.
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Held Interviews Section ────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Held Interview Sessions
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Review individual reports and questions answered in past mock interviews.
            </p>
          </div>

          <Link
            to="/interview"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
          >
            + Start New Interview
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Search by job description or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <Filter size={14} /> Status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Difficulty:
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        {/* Interviews List */}
        {filteredInterviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
            <BookOpen className="mx-auto text-zinc-400" size={36} />
            <h3 className="mt-4 text-base font-semibold text-zinc-700 dark:text-zinc-300">
              No interview sessions found
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {searchQuery || statusFilter !== "ALL" || difficultyFilter !== "ALL"
                ? "Try clearing filters to view all sessions."
                : "Create your first AI mock interview session to get started."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredInterviews.map((item) => {
              const r = item.report;
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500/50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getDifficultyBadge(
                            item.difficulty
                          )}`}
                        >
                          {item.difficulty}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            item.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                          }`}
                        >
                          {item.status === "COMPLETED"
                            ? "COMPLETED"
                            : `IN PROGRESS (${item.currentQuestion}/${item.maxQuestions})`}
                        </span>

                        <span className="text-xs text-zinc-400">
                          Started:{" "}
                          {new Date(item.startedAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <h3 className="line-clamp-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.jobDescription}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 border-t border-zinc-100 pt-4 lg:border-none lg:pt-0">
                      {item.status === "COMPLETED" && r ? (
                        <div
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${getScoreColor(
                            r.score
                          )}`}
                        >
                          <Star size={16} className="fill-current" />
                          <span className="text-base font-bold">{r.score}</span>
                          <span className="text-xs opacity-75">/ 10</span>
                        </div>
                      ) : (
                        <Link
                          to={`/interview/${item.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Resume Session <ArrowUpRight size={16} />
                        </Link>
                      )}

                      {r && (
                        <button
                          onClick={() => setSelectedInterview(item)}
                          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
                        >
                          View Report <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Detailed Session Report Modal ──────────────────────────────── */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            {/* Close Button */}
            <button
              onClick={() => setSelectedInterview(null)}
              className="absolute right-6 top-6 rounded-full bg-zinc-100 p-2 text-zinc-500 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyBadge(
                    selectedInterview.difficulty
                  )}`}
                >
                  {selectedInterview.difficulty}
                </span>
                <span className="text-xs text-zinc-400">
                  ID: {selectedInterview.id}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-white">
                Session Performance Report
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                {selectedInterview.jobDescription}
              </p>
            </div>

            {/* Score Breakdown Cards */}
            {selectedInterview.report && (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-xs font-medium text-zinc-500">Overall Score</p>
                    <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedInterview.report.score} / 10
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-xs font-medium text-zinc-500">Technical</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      {selectedInterview.report.technical} / 10
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-xs font-medium text-zinc-500">Communication</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      {selectedInterview.report.communication} / 10
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-xs font-medium text-zinc-500">Problem Solving</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      {selectedInterview.report.problemSolving} / 10
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-xs font-medium text-zinc-500">Confidence</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      {selectedInterview.report.confidence} / 10
                    </p>
                  </div>
                </div>

                {/* Graph 4: Question Scores Bar Chart */}
                {Array.isArray(selectedInterview.conversation) && (
                  <QuestionScoresBarChart
                    conversation={selectedInterview.conversation}
                  />
                )}

                {/* Summary */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Feedback Summary
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {selectedInterview.report.summary}
                  </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 size={16} /> Strengths
                    </h4>
                    <ul className="mt-3 space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
                      {parseJson(selectedInterview.report.strengths).map(
                        (str, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{str}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900/40 dark:bg-amber-950/30">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
                      <AlertTriangle size={16} /> Weaknesses & Focus Areas
                    </h4>
                    <ul className="mt-3 space-y-2 text-xs text-amber-900 dark:text-amber-200">
                      {parseJson(selectedInterview.report.weaknesses).map(
                        (weak, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                            <span>{weak}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 dark:border-blue-900/40 dark:bg-blue-950/30">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 dark:text-blue-300">
                    <Lightbulb size={16} /> Recommendations
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs text-blue-900 dark:text-blue-200">
                    {parseJson(selectedInterview.report.recommendations).map(
                      (rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Conversation Q&A History with Expected Answer */}
                {Array.isArray(selectedInterview.conversation) &&
                  selectedInterview.conversation.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                        Question & Answer Breakdown
                      </h4>

                      <div className="space-y-4">
                        {selectedInterview.conversation.map((qa, index) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/60"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                Question {index + 1}
                              </span>
                              {qa.score !== null && qa.score !== undefined && (
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                  Score: {qa.score} / 10
                                </span>
                              )}
                            </div>

                            <p className="mt-2 font-semibold text-zinc-900 dark:text-white">
                              {qa.question}
                            </p>

                            {/* Candidate's Answer */}
                            {qa.answer && (
                              <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3.5 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                                <span className="font-bold text-zinc-900 dark:text-white">
                                  Candidate Answer:
                                </span>{" "}
                                {qa.answer}
                              </div>
                            )}

                            {/* AI Model Expected Answer (Subscription Gated) */}
                            {qa.expectedAnswer ? (
                              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
                                <div className="mb-1 flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                                  <CheckCircle2 size={15} /> Expected Ideal Answer (AI Model Answer):
                                </div>
                                <p className="leading-relaxed">{qa.expectedAnswer}</p>
                              </div>
                            ) : (
                              <div className="relative mt-3 overflow-hidden rounded-xl border border-amber-200/80 bg-amber-50/20 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                                {/* Blurry unselectable text representation */}
                                <div className="select-none blur-[5px] opacity-35 pointer-events-none text-xs text-zinc-600 dark:text-zinc-400">
                                  <p className="font-bold mb-1">Expected Ideal Answer (AI Model Answer):</p>
                                  <p>
                                    To answer this question effectively, structure your response using the STAR method. 
                                    Focus on key technical architectural trade-offs, scalability bottlenecks, and clear system design patterns.
                                  </p>
                                </div>

                                {/* Lock Overlay Banner */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-50/90 p-3 text-center backdrop-blur-[1px] dark:bg-zinc-900/90">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                                    <Lock size={14} /> Model Answer Locked (Subscription Feature)
                                  </div>
                                  <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                                    Upgrade to Gold or Platinum plan to unlock full AI model answers.
                                  </p>
                                  <button
                                    onClick={() => setPaymentModalPlan("GOLD")}
                                    className="mt-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-1.5 text-xs font-bold text-black shadow-md transition hover:scale-105"
                                  >
                                    <Zap size={14} /> Upgrade Now to Unlock
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Feedback */}
                            {qa.feedback && (
                              <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                  AI Feedback:
                                </span>{" "}
                                {qa.feedback}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Payment Gateway Checkout Modal ─────────────────────────────── */}
      <PaymentModal
        isOpen={Boolean(paymentModalPlan)}
        planName={paymentModalPlan || "GOLD"}
        onClose={() => setPaymentModalPlan(null)}
        onSuccess={() => window.location.reload()}
      />
    </div>
    </div>
  );
};

export default Profile;
