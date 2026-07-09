import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { paymentService } from './payment.service';

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;

    const result = await paymentService.createPaymentIntoDB(
      customerId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Payment created successfully',
      data: result,
    });
  }
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.confirmPaymentIntoDB(
      req.params.id as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment confirmed successfully',
      data: result,
    });
  }
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;

    const result = await paymentService.getMyPaymentsFromDB(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payments   successfully',
      data: result,
    });
  }
);

const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;

    const result = await paymentService.getSinglePaymentFromDB(
      req.params.id as string,
      customerId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment   successfully',
      data: result,
    });
  }
);

export const paymentController = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getSinglePayment,
};
