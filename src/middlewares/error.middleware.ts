import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error caught:", err);

  // ถ้าเป็น ApiError ที่เราสร้างเอง
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Prisma error (เช่น unique constraint, foreign key, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Duplicate field value: ${err.meta?.target}`,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: `Record not found`,
      });
    }
    return res.status(400).json({
      success: false,
      message: `Database error: ${err.message}`,
    });
  }

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Invalid data provided to database",
    });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Zod / Joi validation error
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors,
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};
