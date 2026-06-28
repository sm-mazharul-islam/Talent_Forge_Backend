import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Production vs Development handling
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production Mode: Don't leak raw database or internal details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Unhandled programmatic errors (e.g., database crash, syntax bugs)
      console.error("💥 ERROR OCURRED:", err);
      res.status(500).json({
        status: "error",
        message: "Something went completely wrong on our side.",
      });
    }
  }
};
