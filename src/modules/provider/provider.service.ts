import { RentalStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';

const getProviderOrdersFromDB = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      gear: {
        providerId,
      },
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      gear: true,
      payment: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const updateProviderOrderStatusIntoDB = async (
  providerId: string,
  rentalId: string,
  status: RentalStatus
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: rentalId,
    },
    include: {
      gear: true,
    },
  });

  if (rental.gear.providerId !== providerId) {
    throw new Error('You are not authorized.');
  }

  const updatedRental = await prisma.rentalOrder.update({
    where: {
      id: rentalId,
    },
    data: {
      status,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      gear: true,
      payment: true,
    },
  });

  return updatedRental;
};

export const providerService = {
  getProviderOrdersFromDB,
  updateProviderOrderStatusIntoDB,
};
