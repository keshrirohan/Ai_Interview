/**
 * interview.service.js
 *
 * Core business logic for all interview operations.
 * Called by interview.controller.js — nothing in here touches req or res.
 *
 * Functions:
 *   startInterview(userId, data)          — enforce plan limit, create session
 *   getFirstQuestion(interviewId)         — generate or resume first question
 *   processInterview(interviewId, answer) — evaluate answer, return next question
 *                                           or final report if all questions done
 */

import { prisma } from "../../lib/prisma.js";
import { PLAN_LIMITS } from "../utils/planLimit.js";
import {
  generateFinalReport,
  generateFirstQuestion,
  processAnswer,
} from "./groq.service.js";

// ─── Start Interview ──────────────────────────────────────────────────────────
export const startInterview = async (userId, data) => {
  const { jobDescription, difficulty } = data;

  // 1. Fetch user and check plan limit in one query
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found.");
  }

  const limit = PLAN_LIMITS[user.plan];

  // Single limit check (duplicate block removed)
  if (user.interviewsUsed >= limit) {
    throw new Error(
      `Interview limit reached. Your ${user.plan} plan allows ${limit} interview${limit === 1 ? "" : "s"}. Please upgrade your subscription.`,
    );
  }

  // 2. Create interview and increment counter in a transaction so they are atomic
  const [interview] = await prisma.$transaction([
    prisma.interview.create({
      data: { userId, jobDescription, difficulty },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { interviewsUsed: { increment: 1 } },
    }),
  ]);

  return interview;
};

// ─── Get / Generate First Question ───────────────────────────────────────────
export const getFirstQuestion = async (interviewId) => {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
  });

  if (!interview) {
    throw new Error("Interview not found.");
  }

  // Resume: if a conversation already exists return the last saved question
  const convo = interview.conversation;

  if (Array.isArray(convo) && convo.length > 0) {
    const last = convo[convo.length - 1];
    return {
      question: last.question,
      expectedAnswer: last.expectedAnswer,
      currentQuestion: interview.currentQuestion || 1,
    };
  }

  // First run: generate via AI
  const aiResponse = await generateFirstQuestion(
    interview.jobDescription,
    interview.difficulty,
  );

  const conversation = [
    {
      question: aiResponse.question,
      expectedAnswer: aiResponse.expectedAnswer,
      answer: null,
      score: null,
      feedback: null,
    },
  ];

  await prisma.interview.update({
    where: { id: interviewId },
    data: { conversation, currentQuestion: 1 },
  });

  return {
    question: aiResponse.question,
    expectedAnswer: aiResponse.expectedAnswer,
    currentQuestion: 1,
  };
};

// ─── Process Interview Answer ─────────────────────────────────────────────────
export const processInterview = async (interviewId, answer) => {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
  });

  if (!interview) {
    throw new Error("Interview not found.");
  }

  let conversation = interview.conversation || [];

  if (conversation.length === 0) {
    throw new Error("No interview question found. Start the interview first.");
  }

  // Save the candidate's answer on the last question slot
  const lastIndex = conversation.length - 1;
  conversation[lastIndex].answer = answer;

  // Evaluate and get next question from AI
  const aiResponse = await processAnswer(
    interview.jobDescription,
    interview.difficulty,
    conversation,
  );

  conversation[lastIndex].score    = aiResponse.score;
  conversation[lastIndex].feedback = aiResponse.feedback;

  // ── Interview complete ────────────────────────────────────────────────────
  if (conversation.length >= interview.maxQuestions) {
    const report = await generateFinalReport(
      interview.jobDescription,
      interview.difficulty,
      conversation,
    );

    // Save report and mark interview completed in one transaction
    const [newReport] = await prisma.$transaction([
      prisma.report.create({
        data: {
          interviewId,
          score:           report.score,
          communication:   report.communication,
          technical:       report.technical,
          confidence:      report.confidence,
          problemSolving:  report.problemSolving,
          strengths:       report.strengths,
          weaknesses:      report.weaknesses,
          recommendations: report.recommendations,
          summary:         report.summary,
        },
      }),
      prisma.interview.update({
        where: { id: interviewId },
        data: {
          conversation,
          status:      "COMPLETED",
          completedAt: new Date(),
        },
      }),
    ]);

    return { completed: true, report };
  }

  // ── More questions remain ─────────────────────────────────────────────────
  conversation.push({
    question:       aiResponse.nextQuestion,
    expectedAnswer: aiResponse.expectedAnswer,
    answer:         null,
    score:          null,
    feedback:       null,
  });

  // Increment currentQuestion counter so resume always lands on the right slot
  const nextCount = interview.currentQuestion + 1;

  await prisma.interview.update({
    where: { id: interviewId },
    data: { conversation, currentQuestion: nextCount },
  });

  return {
    completed:    false,
    score:        aiResponse.score,
    feedback:     aiResponse.feedback,
    nextQuestion: aiResponse.nextQuestion,
    currentQuestion: nextCount,
  };
};
