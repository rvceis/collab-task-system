import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandler.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    console.warn("🚫 No Authorization header provided");
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
      statusCode: 401,
      timestamp: new Date().toISOString(),
    });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.slice(7) 
    : authHeader;

  if (!token || token.trim() === "") {
    console.warn("🚫 Empty token");
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
      statusCode: 401,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }

    console.log("🔍 Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Decoded JWT:", decoded);

    // ✅ store full object (IMPORTANT)
    req.user = decoded;

    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    console.error("Token received:", token.substring(0, 50) + "...");
    
    let statusCode = 401;
    let message = "Token is not valid";

    if (error.name === "TokenExpiredError") {
      message = "Token expired, please login again";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token format";
    }

    res.status(statusCode).json({
      success: false,
      message,
      statusCode,
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export default authMiddleware;