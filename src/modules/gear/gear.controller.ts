import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { gearService } from './gear.service';

const createGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user!.id;

    const gear = await gearService.createGearIntoDB(providerId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Gear created successfully',
      data: gear,
    });
  }
);

const getAllGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gears = await gearService.getAllGearFromDB(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'All gears successfully',
      data: gears,
    });
  }
);

const getSingleGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gear = await gearService.getSingleGearFromDB(req.params.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Gear   successfully',
      data: gear,
    });
  }
);

const updateGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gear = await gearService.updateGearIntoDB(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Gear updated successfully',
      data: gear,
    });
  }
);

const deleteGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await gearService.deleteGearFromDB(
      req.params.id as string,
      req.user!.id,
      req.user!.role
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Gear deleted successfully',
      data: null,
    });
  }
);

export const gearController = {
  createGear,
  getAllGear,
  getSingleGear,
  updateGear,
  deleteGear,
};
