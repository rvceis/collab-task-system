import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandler.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
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
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
      statusCode: 401,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store full JWT payload on request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    
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