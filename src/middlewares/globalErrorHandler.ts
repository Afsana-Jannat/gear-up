import { ErrorRequestHandler } from 'express';

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorDetails: unknown = err;

  // Prisma Record Not Found
  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 404;
    message = err.message;
  }

  // Normal Error
  if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};
