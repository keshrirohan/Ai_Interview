import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {
  deleteContactMessageController,
  deleteUserController,
  getAdminOverviewController,
  getAllSystemInterviewsController,
  getAllSystemPaymentsController,
  getAllUsersController,
  getContactMessagesController,
  updateContactStatusController,
  updateUserPlanController,
  updateUserRoleController,
} from "../controller/admin.controller.js";

const router = express.Router();

// Apply auth + admin middleware to all admin routes
router.use(authMiddleware, adminMiddleware);

// Analytics Overview
router.get("/overview", getAdminOverviewController);

// User Management
router.get("/users", getAllUsersController);
router.patch("/users/:userId/plan", updateUserPlanController);
router.patch("/users/:userId/role", updateUserRoleController);
router.delete("/users/:userId", deleteUserController);

// Contact Inbox
router.get("/contacts", getContactMessagesController);
router.patch("/contacts/:id/status", updateContactStatusController);
router.delete("/contacts/:id", deleteContactMessageController);

// System Activity Logs
router.get("/interviews", getAllSystemInterviewsController);
router.get("/payments", getAllSystemPaymentsController);

export default router;
