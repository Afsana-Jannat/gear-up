import { UserStatus } from '../../../generated/prisma';
import { prisma } from '../../lib/prisma.js';

const getAllUsersFromDB = async () => {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const updateUserStatusIntoDB = async (id: string, status: UserStatus) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
    omit: {
      password: true,
    },
  });
};

const getAllGearFromDB = async () => {
  return prisma.gear.findMany({
    include: {
      category: true,
      provider: {
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

const getAllRentalsFromDB = async () => {
  return prisma.rentalOrder.findMany({
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

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getAllGearFromDB,
  getAllRentalsFromDB,
};
