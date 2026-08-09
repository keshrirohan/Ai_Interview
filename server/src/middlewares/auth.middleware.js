import jwt from "jsonwebtoken";

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

    const secret = process.env.JWT_SECRET;
    if (!secret || secret === "your_jwt_secret_key_here") {
      console.error("[Auth] JWT_SECRET is not configured!");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please contact support.",
      });
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

