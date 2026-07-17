import { prisma } from "../../lib/prisma.js";


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

import { generateFirstQuestion } from "./groq.service.js";

export const getFirstQuestion = async (interviewId) => {
  // Find interview
  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId,
    },
  });

  if (!interview) {
    throw new Error("Interview not found");
  }

  // Generate first question
  const aiResponse = await generateFirstQuestion(
    interview.jobDescription,
    interview.difficulty,
  );

  // Create conversation
  const conversation = [
    {
      question: aiResponse.question,
      answer: null,
      score: null,
      feedback: null,
    },
  ];

  // Save conversation
  await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      conversation,
    },
  });

  return aiResponse.question;
};
