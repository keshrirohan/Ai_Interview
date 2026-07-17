import { prisma } from "../../lib/prisma.js";
import { generateQuestion } from "./groq.service.js";

// Start Interview Service
export const startInterview = async (userId, data) => {
  const { jobDescription, difficulty } = data;

  try {
    // Check interview limit
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Free plan limit
    if (user.plan === "FREE" && user.interviewsUsed >= user.interviewsLimit) {
      throw new Error("Free interview limit reached.");
    }

    // Create Interview Session
    const interview = await prisma.Interview.create({
      data: {
        userId,
        jobDescription,
        difficulty,
      },
    });
    console.log("Interview created:", interview);
    return interview;
  } catch (error) {
    console.error("Error starting interview:", error);
    throw new Error("Failed to start interview.");
  }

  return interview;
};

export const getQuestion = async (interviewId) => {
  // Find interview
  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId,
    },
  });

  // Check interview exists
  if (!interview) {
    throw new Error("Interview not found.");
  }

  // Get AI question
  const question = await generateQuestion(
    interview.jobDescription,
    interview.difficulty,
  );

  // Return question
  return question;
};
