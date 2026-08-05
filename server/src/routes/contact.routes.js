import express from "express";
import { submitContactController } from "../controller/contact.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Optional auth context if user is logged in
router.post("/", (req, res, next) => {
  if (req.cookies?.token) {
    return authMiddleware(req, res, next);
  }
  next();
}, submitContactController);

export default router;
