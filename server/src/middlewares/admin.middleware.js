import { prisma } from "../../lib/prisma.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("[AdminMiddleware] error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export default adminMiddleware;
