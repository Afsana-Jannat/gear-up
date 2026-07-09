import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { rentalService } from './rental.service';

const createRental = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user!.id;

    const rental = await rentalService.createRentalIntoDB(customerId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Rental created successfully',
      data: rental,
    });
  }
);

const getMyRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentals = await rentalService.getMyRentalsFromDB(req.user!.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'My rentals retrieved successfully',
      data: rentals,
    });
  }
);

const getAllRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentals = await rentalService.getAllRentalsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'All rentals retrieved successfully',
      data: rentals,
    });
  }
);

const updateRentalStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rental = await rentalService.updateRentalStatusIntoDB(
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Rental status updated successfully',
      data: rental,
    });
  }
);

export const rentalController = {
  createRental,
  getMyRentals,
  getAllRentals,
  updateRentalStatus,
};
