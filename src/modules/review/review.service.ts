import { prisma } from '../../lib/prisma';
import { ICreateReview } from './review.interface';

const createReviewIntoDB = async (
  customerId: string,
  payload: ICreateReview
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: payload.rentalOrderId,
    },
  });

  if (rental.customerId !== customerId) {
    throw new Error('You are not authorized to review this rental.');
  }

  if (rental.status !== 'RETURNED') {
    throw new Error('You can review only after returning the gear.');
  }

  const reviewExists = await prisma.review.findUnique({
    where: {
      rentalOrderId: payload.rentalOrderId,
    },
  });

  if (reviewExists) {
    throw new Error('Review already submitted.');
  }

  await prisma.gear.findUniqueOrThrow({
    where: {
      id: payload.gearId,
    },
  });
};

export const reviewService = {
  createReviewIntoDB,
};
