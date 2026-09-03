import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getJwtSecret = () => {
  let secret = process.env.JWT_SECRET;
  if (!secret) {
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });
    secret = process.env.JWT_SECRET;
  }
  return secret;
};

/**
 * authMiddleware
 *
 * Verifies the JWT from:
 *   1. httpOnly cookie (primary — set at login)
 *   2. Authorization: Bearer <token> header (fallback for mobile / non-browser)
 *
 * Attaches decoded payload to req.user and calls next(), or returns 401.
 */
const authMiddleware = (req, res, next) => {
  try {
    // Prefer cookie; fall back to Authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in.",
      });
    }

    let secret = getJwtSecret();
    if (!secret || secret === "your_jwt_secret_key_here") {
      // In development fallback to default secret to prevent 500 configuration block
      if (process.env.NODE_ENV !== "production") {
        secret = "521984fda052147d1fcf2333cf1b0a78754d7bcd46a3f40e0a6bcf68e88d3de2e6965bda25bd2074ff952d425362f42c2e06eb2d330795d1c4d1c211215c513c";
      } else {
        console.error("[Auth] JWT_SECRET is not configured!");
        return res.status(500).json({
          success: false,
          message: "Server configuration error. Please contact support.",
        });
      }
    }

    req.user = jwt.verify(token, secret);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please log in again.",
    });
  }
};

export default authMiddleware;

