/**
 * groq.service.js
 *
 * All communication with the Groq LLM API (LLaMA 3.3 70B).
 * This is the only file in the project that talks to the AI.
 *
 * Every function:
 *   1. Builds a prompt with context (job description, difficulty, conversation)
 *   2. Calls groqClient.chat.completions.create with response_format: json_object
 *   3. Parses and returns the JSON result
 *
 * Using response_format: { type: "json_object" } forces the model to always
 * return valid JSON — no extra parsing or error handling needed for format issues.
 *
 * Exported functions:
 *   generateRole(jobDescription)                          — derive a job title
 *   generateFirstQuestion(jobDescription, difficulty)    — first interview question
 *   processAnswer(jobDescription, difficulty, conversation) — evaluate + next question
 *   generateFinalReport(jobDescription, difficulty, conversation) — end-of-interview report
 */

import Groq from "groq-sdk";

// Groq client is instantiated once at module level and reused for all calls
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.3-70b-versatile";

// ─── Generate Role ────────────────────────────────────────────────────────────
/**
 * Derives a job title from a job description.
 * Called on GET /interview/:id to show a human-readable role label in the UI.
 *
 * @param {string} jobDescription
 * @returns {{ role: string }}
 */
export const generateRole = async (jobDescription) => {
  const prompt = `
You are a Senior Software Engineer Interviewer.
Job Description:
${jobDescription}
Generate a suitable role name for this job description.
Return ONLY valid JSON: { "role": "..." }
`;

  const response = await groqClient.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

// ─── Generate First Question ──────────────────────────────────────────────────
/**
 * Generates the opening interview question for a given job description and difficulty.
 * Only called when no conversation exists yet (new interview, not a resume).
 *
 * @param {string} jobDescription
 * @param {string} difficulty — "EASY" | "MEDIUM" | "HARD"
 * @returns {{ question: string, expectedAnswer: string }}
 */
export const generateFirstQuestion = async (jobDescription, difficulty) => {
  const prompt = `
You are a Senior Software Engineer Interviewer.

Job Description:
${jobDescription}

Difficulty: ${difficulty}

Generate ONLY ONE interview question based on the job description.
Also provide the ideal expected answer a strong candidate should give.

Return ONLY valid JSON:
{
  "question": "...",
  "expectedAnswer": "..."
}
`;

  const response = await groqClient.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

// ─── Process Answer ───────────────────────────────────────────────────────────
/**
 * Evaluates the candidate's latest answer and generates the next question.
 * Receives the full conversation history so the AI never repeats questions.
 *
 * @param {string} jobDescription
 * @param {string} difficulty
 * @param {Array}  conversation — full conversation array from the DB
 * @returns {{ score: number, feedback: string, nextQuestion: string, expectedAnswer: string }}
 */
export const processAnswer = async (jobDescription, difficulty, conversation) => {
  const prompt = `
You are a Senior Software Engineering Interviewer.

Job Description:
${jobDescription}

Difficulty: ${difficulty}

Conversation so far:
${JSON.stringify(conversation)}

Your tasks:
1. Evaluate ONLY the latest answer.
2. Give a score out of 10.
3. Give short, constructive feedback.
4. Ask ONE new interview question (never repeat a previous one).
5. Provide the expected answer for the next question.

Return ONLY valid JSON:
{
  "score": 8,
  "feedback": "Good answer. Try to mention X for more depth.",
  "nextQuestion": "Explain how X works in detail.",
  "expectedAnswer": "..."
}
`;

  try {
    const response = await groqClient.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    // Re-throw with a clear message so the controller can return it to the client
    throw new Error("Failed to process interview answer. Please try again.");
  }
};

// ─── Generate Final Report ────────────────────────────────────────────────────
/**
 * Analyses the complete interview conversation and produces a performance report.
 * Called after the candidate answers the final question (maxQuestions reached).
 *
 * @param {string} jobDescription
 * @param {string} difficulty
 * @param {Array}  conversation — full completed conversation array
 * @returns {{ score, technical, communication, confidence, problemSolving,
 *             strengths, weaknesses, recommendations, summary }}
 */
export const generateFinalReport = async (jobDescription, difficulty, conversation) => {
  const prompt = `
You are a Senior Software Engineering Interviewer.

Job Description:
${jobDescription}

Difficulty: ${difficulty}

Complete Interview Conversation:
${JSON.stringify(conversation)}

Analyse the entire interview and return a detailed performance report.

Return ONLY valid JSON:
{
  "score": 8.5,
  "technical": 8,
  "communication": 9,
  "problemSolving": 8,
  "confidence": 8,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "summary": "..."
}
`;

  try {
    const response = await groqClient.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to generate interview report. Please try again.");
  }
};
