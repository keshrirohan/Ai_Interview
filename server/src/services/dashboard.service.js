/**
 * dashboard.service.js
 *
 * Aggregates user profile info, overall interview statistics,
 * consolidated overall report insights, and all held interview sessions with reports.
 */

import { prisma } from "../../lib/prisma.js";
import { PLAN_LIMITS } from "../utils/planLimit.js";

export const getDashboard = async (userId) => {
  // 1. Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      interviewsUsed: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // 2. Fetch all held interviews with reports
  const interviews = await prisma.interview.findMany({
    where: { userId },
    include: {
      report: true,
    },
    orderBy: { startedAt: "desc" },
  });

  // 3. Aggregate report metrics across all sessions
  const stats = await prisma.report.aggregate({
    where: {
      interview: { userId },
    },
    _avg: {
      score: true,
      technical: true,
      communication: true,
      confidence: true,
      problemSolving: true,
    },
    _max: { score: true },
    _min: { score: true },
    _count: { id: true },
  });

  // 4. Consolidate strengths, weaknesses, recommendations for overall report
  const completedReports = interviews
    .map((item) => item.report)
    .filter(Boolean);

  const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return [field];
      }
    }
    return [];
  };

  const aggregatedStrengths = Array.from(
    new Set(completedReports.flatMap((r) => parseJsonField(r.strengths)))
  );
  const aggregatedWeaknesses = Array.from(
    new Set(completedReports.flatMap((r) => parseJsonField(r.weaknesses)))
  );
  const aggregatedRecommendations = Array.from(
    new Set(completedReports.flatMap((r) => parseJsonField(r.recommendations)))
  );

  const limit = PLAN_LIMITS[user.plan] || 20;
  const remainingInterviews = Math.max(0, limit - user.interviewsUsed);

  return {
    user,
    stats: {
      plan: user.plan,
      limit,
      interviewsUsed: user.interviewsUsed,
      remainingInterviews,
      totalInterviews: interviews.length,
      totalCompletedInterviews: stats._count.id || 0,
      averageScore: Number((stats._avg.score || 0).toFixed(1)),
      averageTechnical: Number((stats._avg.technical || 0).toFixed(1)),
      averageCommunication: Number((stats._avg.communication || 0).toFixed(1)),
      averageConfidence: Number((stats._avg.confidence || 0).toFixed(1)),
      averageProblemSolving: Number((stats._avg.problemSolving || 0).toFixed(1)),
      bestScore: Number((stats._max.score || 0).toFixed(1)),
      lowestScore: Number((stats._min.score || 0).toFixed(1)),
    },
    overallReport: {
      overallScore: Number((stats._avg.score || 0).toFixed(1)),
      technical: Number((stats._avg.technical || 0).toFixed(1)),
      communication: Number((stats._avg.communication || 0).toFixed(1)),
      confidence: Number((stats._avg.confidence || 0).toFixed(1)),
      problemSolving: Number((stats._avg.problemSolving || 0).toFixed(1)),
      strengths: aggregatedStrengths,
      weaknesses: aggregatedWeaknesses,
      recommendations: aggregatedRecommendations,
      summary:
        completedReports.length > 0
          ? `Based on ${completedReports.length} completed interview session(s), your average overall score is ${Number(
              (stats._avg.score || 0).toFixed(1)
            )}/10. Continue honing your technical depth and structured communication to excel in upcoming software engineering interviews.`
          : "No completed interviews yet. Start your first mock interview to generate your performance report!",
    },
    interviews,
  };
};
