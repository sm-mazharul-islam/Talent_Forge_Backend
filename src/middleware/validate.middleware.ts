import { Request, Response, NextFunction } from "express";
// 1. Import 'ZodObject' instead of the deprecated 'AnyZodObject'
import { ZodObject, ZodError } from "zod";

/**
 * A reusable higher-order middleware function that wraps around a Zod validation schema
 * We use ZodObject<any> to accept any configured Zod layout shape.
 */
export const validate = (schema: ZodObject<any>) => {
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
          // 2. Changed error.errors to error.issues for Zod v4 compatibility
          errors: error.issues.map((issue) => ({
            field: issue.path[1], // Tells the user exactly which field failed (e.g., 'price')
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
