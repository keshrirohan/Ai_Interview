import Groq from "groq-sdk";

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate First Question
export const generateFirstQuestion = async (jobDescription, difficulty) => {
  const prompt = `
You are a Senior Software Engineer Interviewer.

Job Description:
${jobDescription}

Difficulty:
${difficulty}

Generate ONLY ONE interview question.

Return JSON:

{
  "question":"..."
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  return JSON.parse(response.choices[0].message.content);
};
