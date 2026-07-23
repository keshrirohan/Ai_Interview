import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import { getDashboardController } from "../controller/dashboard.controller.js";

const router = express.Router();

// Dashboard
router.get("/", authMiddleware, getDashboardController);

export default router;
