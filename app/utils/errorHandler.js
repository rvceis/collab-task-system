/**
 * Custom Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error Handler Function - Call this in catch blocks
 */
export const handleError = (error, res, context = "") => {
  console.error(`\n❌ [ERROR] ${context}`, {
    message: error.message,
    statusCode: error.statusCode || 500,
    details: error.details,
    stack: error.stack,
  });

  // If it's our custom AppError, use its status code
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: error.timestamp,
    });
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      statusCode: 401,
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
      statusCode: 401,
      details: "Please login again",
      timestamp: new Date().toISOString(),
    });
  }

  // Handle Database errors
  if (error.code === "23505") {
    // Unique constraint violation
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
      statusCode: 409,
      details: "Duplicate entry",
      timestamp: new Date().toISOString(),
    });
  }

  if (error.code === "23503") {
    // Foreign key violation
    return res.status(400).json({
      success: false,
      message: "Invalid reference",
      statusCode: 400,
      details: "Referenced resource does not exist",
      timestamp: new Date().toISOString(),
    });
  }

  if (error.code && error.code.startsWith("23")) {
    // Other database constraint errors
    return res.status(400).json({
      success: false,
      message: "Invalid data",
      statusCode: 400,
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    statusCode: 500,
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Validation Error Helper
 */
export const validateInput = (fields, data) => {
  const errors = {};

  for (const field of fields) {
    if (!data[field] || String(data[field]).trim() === "") {
      errors[field] = `${field} is required`;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(
      "Validation failed",
      400,
      errors
    );
  }
};

/**
 * Check Authorization Helper
 */
export const checkAuthorization = (userId, resourceOwnerId, resourceType = "resource") => {
  if (userId !== resourceOwnerId) {
    throw new AppError(
      `You don't have permission to modify this ${resourceType}`,
      403,
      { userId, resourceOwnerId }
    );
  }
};

/**
 * Not Found Error Helper
 */
export const notFound = (resourceType, identifier = null) => {
  throw new AppError(
    `${resourceType} not found`,
    404,
    identifier ? { identifier } : null
  );
};
