import { startInterview } from "../services/interview.service.js";
import { getQuestion } from "../services/interview.service.js";

// Start Interview Controller
export const startInterviewController = async (req, res) => {
  try {
    // Call service

    const interview = await startInterview(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Interview started successfully",
      data: interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate First Interview Question
export const generateInterviewQuestion = async (req, res) => {
  try {
    // Get interviewId from request body
    console.log("Request Body:", req.body);
    const { interviewId } = req.body;

    // Generate question
    const question = await getQuestion(interviewId);

    // Send response
    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Generate Question Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
