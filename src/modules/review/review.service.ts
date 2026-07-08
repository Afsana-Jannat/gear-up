import { prisma } from '../../lib/prisma';
import { ICreateReview } from './review.interface';

const createReviewIntoDB = async (
  customerId: string,
  payload: ICreateReview
) => {
  // Rental must exist
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: payload.rentalOrderId,
    },
  });

  // Customer can review only own rental
  if (rental.customerId !== customerId) {
    throw new Error('You are not authorized to review this rental.');
  }

  // Rental must be returned
  if (rental.status !== 'RETURNED') {
    throw new Error('You can review only after returning the gear.');
  }

  // One review per rental
  const reviewExists = await prisma.review.findUnique({
    where: {
      rentalOrderId: payload.rentalOrderId,
    },
  });

  if (reviewExists) {
    throw new Error('Review already submitted.');
  }

  // Gear exists
  await prisma.gear.findUniqueOrThrow({
    where: {
      id: payload.gearId,
    },
  });

  const review = await prisma.review.create({
    data: {
      customerId,
      rentalOrderId: payload.rentalOrderId,
      gearId: payload.gearId,
      rating: payload.rating,
      comment: payload.comment,
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

  return review;
};

const getReviewsByGearFromDB = async (gearId: string) => {
  return await prisma.review.findMany({
    where: {
      gearId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const reviewService = {
  createReviewIntoDB,
  getReviewsByGearFromDB,
};
