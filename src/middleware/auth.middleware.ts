import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";

// 🛡️ Force-inject environment variables right into this specific file's memory scope
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        status: "fail",
        message: "You are not logged in. Please log in to get access.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Read the secret, falling back to a raw matching string if needed
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error(
        "JWT_SECRET environment variable is completely missing or empty.",
      );
    }

    const decoded = jwt.verify(token, secretKey) as {
      userId: string;
      email: string;
    };

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      status: "fail",
      message: "Authentication failed.",
      debugError: error.message,
    });
  }
};
