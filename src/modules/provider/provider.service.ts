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

// const updateProviderOrderStatusIntoDB = async (
//   providerId: string,
//   rentalId: string,
//   status: RentalStatus
// ) => {
//   const rental = await prisma.rentalOrder.findUniqueOrThrow({
//     where: {
//       id: rentalId,
//     },
//     include: {
//       gear: true,
//     },
//   });

//   if (rental.gear.providerId !== providerId) {
//     throw new Error('You are not authorized.');
//   }

//   const updatedRental = await prisma.rentalOrder.update({
//     where: {
//       id: rentalId,
//     },
//     data: {
//       status,
//     },
//     include: {
//       customer: {
//         omit: {
//           password: true,
//         },
//       },
//       gear: true,
//       payment: true,
//     },
//   });

//   return updatedRental;
// };

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

  // Prevent updating finished rentals
  if (
    rental.status === RentalStatus.CANCELLED ||
    rental.status === RentalStatus.RETURNED
  ) {
    throw new Error('This rental can no longer be updated.');
  }

  // Allowed status transitions
  const allowedTransitions: Record<RentalStatus, RentalStatus[]> = {
    PLACED: [RentalStatus.CONFIRMED, RentalStatus.CANCELLED],
    CONFIRMED: [RentalStatus.CANCELLED],
    PAID: [RentalStatus.PICKED_UP],
    PICKED_UP: [RentalStatus.RETURNED],
    RETURNED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[rental.status].includes(status)) {
    throw new Error(`Cannot change status from ${rental.status} to ${status}.`);
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
const getMyGearsFromDB = async (providerId: string) => {
  return await prisma.gear.findMany({
    where: {
      providerId,
      isDeleted: false,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getProviderEarningsFromDB = async (providerId: string) => {
  const rentals = await prisma.rentalOrder.findMany({
    where: {
      gear: {
        providerId,
      },
    },
    include: {
      gear: true,
      customer: {
        omit: {
          password: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalEarnings = rentals
    .filter((rental) => rental.payment && rental.payment.status === 'COMPLETED')
    .reduce((sum, rental) => sum + Number(rental.payment!.amount), 0);

  const completedRentals = rentals.filter(
    (rental) => rental.status === 'RETURNED'
  ).length;

  const pendingPayments = rentals.filter(
    (rental) => !rental.payment || rental.payment.status === 'PENDING'
  ).length;

  const totalGears = await prisma.gear.count({
    where: {
      providerId,
      isDeleted: false,
    },
  });

  return {
    summary: {
      totalEarnings,
      completedRentals,
      pendingPayments,
      totalGears,
    },
    recentPayments: rentals,
  };
};

export const providerService = {
  getProviderOrdersFromDB,
  updateProviderOrderStatusIntoDB,
  getMyGearsFromDB,
  getProviderEarningsFromDB,
};
