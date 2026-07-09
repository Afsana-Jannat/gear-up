import { prisma } from '../../lib/prisma';
import { RentalStatus } from '../../../generated/prisma';
import { ICreateRental, IUpdateRentalStatus } from './rental.interface';

const createRentalIntoDB = async (
  customerId: string,
  payload: ICreateRental
) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id: payload.gearId,
    },
  });

  if (gear.availability !== 'AVAILABLE') {
    throw new Error('Gear is currently unavailable.');
  }

  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (endDate <= startDate) {
    throw new Error('End date must be after start date.');
  }

  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) || 1;

  const totalAmount = Number(gear.pricePerDay) * totalDays;

  const rental = await prisma.rentalOrder.create({
    data: {
      customerId,
      gearId: payload.gearId,
      startDate,
      endDate,
      totalAmount,
      status: RentalStatus.PLACED,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      gear: true,
    },
  });

  return rental;
};

const getMyRentalsFromDB = async (customerId: string) => {
  return await prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: {
      gear: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getAllRentalsFromDB = async () => {
  return await prisma.rentalOrder.findMany({
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      gear: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const updateRentalStatusIntoDB = async (
  id: string,
  payload: IUpdateRentalStatus
) => {
  await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return await prisma.rentalOrder.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      gear: true,
    },
  });
};

export const rentalService = {
  createRentalIntoDB,
  getMyRentalsFromDB,
  getAllRentalsFromDB,
  updateRentalStatusIntoDB,
};
