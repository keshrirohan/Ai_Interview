import { createContactMessageService } from "../services/contact.service.js";

export const submitContactController = async (req, res) => {
  try {
    const userId = req.user?.userId || null;
    const result = await createContactMessageService(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
      data: result,
    });
  } catch (error) {
    console.error("[Contact] submission error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit contact message.",
    });
  }
};
