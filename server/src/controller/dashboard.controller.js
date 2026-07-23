import { getDashboard } from "../services/dashboard.service.js";

// Get Dashboard Statistics
export const getDashboardController = async (req, res) => {
  try {
    // User id comes from auth middleware
    const userId = req.user.userId;
   

    // Get dashboard data
    const dashboard = await getDashboard(userId);

    // Send response
    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
