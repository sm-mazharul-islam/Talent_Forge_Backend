import { Request, Response, NextFunction } from "express";
// 1. Using ZodTypeAny as the modern standard to support flexible compilation objects
import { ZodTypeAny, ZodError } from "zod";

/**
 * A reusable higher-order middleware function that wraps around a Zod validation schema
 */
export const validate = (schema: ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Parse the incoming request parts (body, query, params) against the Zod schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // If validation succeeds, move execution to the next controller function
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // If it's a Zod validation error, intercept it and return a 400 Bad Request
        res.status(400).json({
          status: "fail",
          // 2. Using error.issues for clean Zod compatibility mapping
          errors: error.issues.map((issue) => ({
            field: issue.path[1] || issue.path[0], // Gracefully handle varying path array depths
            message: issue.message,
          })),
        });
        return;
      }
      // Pass any non-Zod unexpected errors down to the global error handler
      next(error);
    }
  };
};
