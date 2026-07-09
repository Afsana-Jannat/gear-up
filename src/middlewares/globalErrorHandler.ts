import { NextFunction, Request, Response } from 'express';
import { Prisma } from '../../generated/prisma';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = err.message || 'Something went wrong';

  // client Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Validation Error';
  }

  // Client Known Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
