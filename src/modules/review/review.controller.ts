import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { reviewService } from './review.service';

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;

    const review = await reviewService.createReviewIntoDB(customerId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Review created successfully',
      data: review,
    });
  }
);

const getReviewsByGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await reviewService.getReviewsByGearFromDB(
      req.params.id as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Reviews get successfully',
      data: reviews,
    });
  }
);

export const reviewController = {
  createReview,
  getReviewsByGear,
};
