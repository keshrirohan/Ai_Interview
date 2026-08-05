import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createOrderController,
  getPaymentHistoryController,
  verifyPaymentController,
} from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrderController);
router.post("/verify", authMiddleware, verifyPaymentController);
router.get("/history", authMiddleware, getPaymentHistoryController);

export default router;
