import {
  createOrderService,
  getPaymentHistoryService,
  verifyPaymentService,
} from "../services/payment.service.js";

export const createOrderController = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.userId;

    const orderData = await createOrderService(userId, plan);

    res.status(200).json({
      success: true,
      message: "Payment order created.",
      data: orderData,
    });
  } catch (error) {
    console.error("[Payment] createOrder error:", error);
    const isValidationError = error.message.includes("Downgrade") || error.message.includes("Invalid");
    res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: error.message || "Failed to create payment order.",
    });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await verifyPaymentService(userId, req.body);

    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${result.user.plan} Plan!`,
      data: result,
    });
  } catch (error) {
    console.error("[Payment] verifyPayment error:", error);
    const isValidationError = error.message.includes("downgrade") || error.message.includes("verification failed");
    res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: error.message || "Payment verification failed.",
    });
  }
};

export const getPaymentHistoryController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await getPaymentHistoryService(userId);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("[Payment] getHistory error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
