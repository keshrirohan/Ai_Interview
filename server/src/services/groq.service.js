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

Generate ONLY ONE interview question based on the job description.

Also generate the ideal expected answer that a strong candidate should give.

Return ONLY valid JSON.

Return JSON:

{
  "question":"..."
  "expectedAnswer":"..."
}
`;

  const response = await groqClient.chat.completions.create({
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

// Evaluate answer and generate next question
export const processAnswer = async (
  jobDescription,
  difficulty,
  conversation,
) => {
  try {
    const prompt = `
You are a Senior Software Engineering Interviewer.

Job Description:
${jobDescription}

Difficulty:
${difficulty}

Conversation:
${JSON.stringify(conversation)}

Your task:

1. Evaluate ONLY the latest answer.
2. Give a score out of 10.
3. Give short constructive feedback.
4. Ask ONE next interview question.
5. Never repeat previous questions.
6. Provide a expected answer for the next question.

Return ONLY JSON.

{
  "expectedAnswer": "The React Fiber Architecture is a reimplementation of the React core algorithm. It allows React to break rendering work into units and prioritize them, enabling smoother user experiences and better handling of complex applications.",
  "score": 8,
  "feedback": "Good answer. Explain reconciliation in more detail.",
  "nextQuestion": "Explain React Fiber Architecture."
  
}
`;

    const response = await groqClient.chat.completions.create({
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
  } catch (error) {
    console.log(error);
    throw new Error("Failed to process interview.");
  }
};
