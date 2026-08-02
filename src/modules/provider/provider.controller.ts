import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { RentalStatus } from '@prisma/client';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { providerService } from './provider.service.js';

const getProviderOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user!.id;

    const result = await providerService.getProviderOrdersFromDB(providerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Provider orders   successfully',
      data: result,
    });
  }
);

const updateProviderOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user!.id;

    const result = await providerService.updateProviderOrderStatusIntoDB(
      providerId,
      req.params.id as string,
      req.body.status as RentalStatus
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Order status updated successfully',
      data: result,
    });
  }
);

const getMyGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await providerService.getMyGearsFromDB(req.user!.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Provider gears retrieved successfully',
      data: result,
    });
  }
);

const getProviderEarnings = catchAsync(async (req, res) => {
  const result = await providerService.getProviderEarningsFromDB(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Provider earnings retrieved successfully',
    data: result,
  });
});

export const providerController = {
  getProviderOrders,
  updateProviderOrderStatus,
  getMyGears,
  getProviderEarnings,
};
