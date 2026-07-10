import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validateRequest =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation Error',
        errorDetails: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
