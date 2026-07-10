import { ErrorRequestHandler } from 'express';
import { Prisma } from '../../generated/prisma';
import httpStatus from 'http-status';
import { ZodError } from 'zod';

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong';
  let errorDetails: { path: string; message: string }[] = [];

  // Zod Error
  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation Error';

    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // Prisma Validation
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Prisma Validation Error';

    errorDetails = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  // Prisma Known
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      statusCode = httpStatus.NOT_FOUND;
      message = 'Resource not found';
    } else if (err.code === 'P2002') {
      statusCode = httpStatus.CONFLICT;
      message = 'Duplicate value found';
    } else {
      statusCode = httpStatus.BAD_REQUEST;
      message = err.message;
    }

    errorDetails = [
      {
        path: '',
        message,
      },
    ];
  }

  // Normal Error
  else if (err instanceof Error) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message;

    errorDetails = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};
