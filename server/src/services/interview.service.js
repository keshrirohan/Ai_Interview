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
  console.log("Found interview:", interview);
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
      expectedAnswer: aiResponse.expectedAnswer,
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

import { processAnswer } from "./groq.service.js";

// Process Interview Answer
export const processInterview = async (interviewId, answer) => {
  // 1. Find interview
  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId,
    },
  });

  // Check interview exists
  if (!interview) {
    throw new Error("Interview not found.");
  }

  // 2. Get previous conversation
  let conversation = interview.conversation || [];

  // Check if interview has started
  if (conversation.length === 0) {
    throw new Error("No interview question found.");
  }

  console.log("Current conversation:", conversation);
  // 3. Get last question
  const lastIndex = conversation.length - 1;

  // 4. Save user's answer
  conversation[lastIndex].answer = answer;

  // 5. Send conversation to Groq
  const aiResponse = await processAnswer(
    interview.jobDescription,
    interview.difficulty,
    conversation,
  );

  console.log("AI Response:", aiResponse);

  // 6. Update score & feedback
  conversation[lastIndex].score = aiResponse.score;

  conversation[lastIndex].feedback = aiResponse.feedback;

  // 7. Add next question
  conversation.push({
    question: aiResponse.nextQuestion,
    answer: null,
    score: null,
    feedback: null,
  });

  // 8. Save updated conversation
  await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      conversation,
    },
  });

  // 9. Return response
  return aiResponse;
};
