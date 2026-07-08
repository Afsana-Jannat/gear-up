import { prisma } from '../../lib/prisma';
import { ICreateGear, IUpdateGear } from './gear.interface';

const createGearIntoDB = async (providerId: string, payload: ICreateGear) => {
  // Check Category
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const gear = await prisma.gear.create({
    data: {
      ...payload,
      providerId,
    },
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });

  return gear;
};

const getAllGearFromDB = async () => {
  const gears = await prisma.gear.findMany({
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

  return gears;
};

const getSingleGearFromDB = async (id: string) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });

  return gear;
};

const updateGearIntoDB = async (
  id: string,
  providerId: string,
  payload: IUpdateGear
) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // Only owner can update
  if (gear.providerId !== providerId) {
    throw new Error('You are not authorized to update this gear.');
  }

  // Category check (if category changed)
  if (payload?.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: {
        id: payload.categoryId,
      },
    });
  }

  const updatedGear = await prisma.gear.update({
    where: {
      id,
    },
    data: payload,
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });

  return updatedGear;
};

const deleteGearFromDB = async (id: string, providerId: string) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (gear.providerId !== providerId) {
    throw new Error('You are not authorized to delete this gear.');
  }

  await prisma.gear.delete({
    where: {
      id,
    },
  });

  return null;
};

export const gearService = {
  createGearIntoDB,
  getAllGearFromDB,
  getSingleGearFromDB,
  updateGearIntoDB,
  deleteGearFromDB,
};
