import { startInterview } from "../services/interview.service.js";
import {
  getFirstQuestion,
  processInterview,
} from "../services/interview.service.js";

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
    const { interviewId } = req.params;
    console.log("Generating question for interviewId:", interviewId);

    const question = await getFirstQuestion(interviewId);
    console.log("Generated question:", question);
    res.json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Process Candidate Answer
export const processInterviewController = async (req, res) => {
  try {
    // Get interview id from URL
    const { interviewId } = req.params;

    // Get answer from frontend
    const { answer } = req.body;

    // Basic validation
    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Answer is required.",
      });
    }

    // Process interview
    const result = await processInterview(interviewId, answer);

    // Send response
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Process Interview Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
