import Groq from "groq-sdk";

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateQuestion = async (jobDescription, difficulty) => {
  try {
    // Prompt for AI
    const prompt = `
You are an expert technical interviewer.

Job Description:
${jobDescription}

Difficulty:
${difficulty}

Rules:
- Generate ONLY ONE interview question.
- Do not provide the answer.
- Return only the question.
`;

    // Send request to Groq
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7, // it use for creativity, higher value means more creativity, range from 0 to 1
    });

    // Return generated question
    console.log("Generated Question:", response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.log("Groq Error:", error.message);
    throw new Error("Failed to generate question.");
  }
};
