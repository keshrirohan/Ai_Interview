import { prisma } from "../../lib/prisma.js";
import { PLAN_LIMITS } from "../utils/planLimit.js";


// Get Dashboard Statistics
export const getDashboard = async (userId) => {
  // Get user
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Aggregate report statistics
  const stats = await prisma.report.aggregate({
    where: {
      interview: {
        userId,
      },
    },

    _avg: {
      score: true,
      technical: true,
      communication: true,
      confidence: true,
      problemSolving: true,
    },

    _max: {
      score: true,
    },

    _min: {
      score: true,
    },

    _count: {
      id: true,
    },
  });

  // Remaining interviews
  const interviewLimit = PLAN_LIMITS[user.plan];

  const remainingInterviews = interviewLimit - user.interviewsUsed;

  // Return Dashboard Data
  return {
    plan: user.plan,

    interviewsUsed: user.interviewsUsed,

    remainingInterviews,

    totalCompletedInterviews: stats._count.id,

    averageScore: stats._avg.score || 0,

    averageTechnical: stats._avg.technical || 0,

    averageCommunication: stats._avg.communication || 0,

    averageConfidence: stats._avg.confidence || 0,

    averageProblemSolving: stats._avg.problemSolving || 0,

    bestScore: stats._max.score || 0,

    lowestScore: stats._min.score || 0,
  };
};
