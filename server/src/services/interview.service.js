import { prisma } from "../../lib/prisma.js";
import { generateFinalReport, generateFirstQuestion, processAnswer } from "./groq.service.js";
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

  return aiResponse;
};



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

  // 6. Update score & feedback
  conversation[lastIndex].score = aiResponse.score;
  conversation[lastIndex].feedback = aiResponse.feedback;

  if (conversation.length >= interview.maxQuestions) {
    // Generate Final Report
    const report = await generateFinalReport(
      interview.jobDescription,
      interview.difficulty,
      conversation,
    );

    // Save Report
    await prisma.report.create({
      data: {
        interviewId,

        score: report.score,

        communication: report.communication,

        technical: report.technical,

        confidence: report.confidence,

        problemSolving: report.problemSolving,

        strengths: report.strengths,

        weaknesses: report.weaknesses,

        recommendations: report.recommendations,

        summary: report.summary,
      },
    });

    await prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        conversation,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return {
      completed: true,
      report,
    };
  }

  // 7. Add next question
  conversation.push({
    question: aiResponse.nextQuestion,
    expectedAnswer: aiResponse.expectedAnswer,
    answer: null,
    score: null,
    feedback: null,
  });

  // Save Conversation
  await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      conversation,
    },
  });

  return {
    completed: false,

    score: aiResponse.score,

    feedback: aiResponse.feedback,

    nextQuestion: aiResponse.nextQuestion,
  };
};
