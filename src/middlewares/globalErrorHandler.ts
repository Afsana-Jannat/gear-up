import { ErrorRequestHandler } from 'express';
import { Prisma } from '../../generated/prisma';

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorDetails: unknown = [];

  // Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = err.message;
  }

  // Prisma Known Error
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    if (err.code === 'P2002') {
      message = 'Duplicate value found.';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found.';
    } else {
      message = err.message;
    }

    errorDetails = err.meta ?? [];
  }

  // Normal Error
  else if (err instanceof Error) {
    message = err.message;
    errorDetails = [];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};
