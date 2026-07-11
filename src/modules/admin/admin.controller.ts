import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { UserStatus } from '../../../generated/prisma';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { adminService } from './admin.sevice.js';

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsersFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Users   successfully',
      data: result,
    });
  }
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.updateUserStatusIntoDB(
      req.params.id as string,
      req.body.status as UserStatus
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User status updated successfully',
      data: result,
    });
  }
);

const getAllGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllGearFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Gear   successfully',
      data: result,
    });
  }
);

const getAllRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentalsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Rentals   successfully',
      data: result,
    });
  }
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
