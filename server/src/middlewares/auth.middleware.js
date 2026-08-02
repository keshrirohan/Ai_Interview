import jwt from "jsonwebtoken";

/**
 * authMiddleware
 *
 * Verifies the JWT from the httpOnly cookie (or Authorization header as
 * a fallback for non-browser clients).  Attaches the decoded payload to
 * req.user and calls next(), or returns 401.
 */
const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in.",
      });
    }

    // Verify and attach — no console.log so sensitive payloads never leak
    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;
