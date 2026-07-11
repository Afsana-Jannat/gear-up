import { Role } from '../../../generated/prisma';
import { prisma } from '../../lib/prisma.js';
import { ICreateGear, IGearQuery, IUpdateGear } from './gear.interface.js';

const createGearIntoDB = async (providerId: string, payload: ICreateGear) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const gear = await prisma.gear.create({
    data: {
      ...payload,
      providerId,
      availability: payload.stock > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK',
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

const getAllGearFromDB = async (query: IGearQuery) => {
  const {
    search,
    categoryId,
    brand,
    availability,
    minPrice,
    maxPrice,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const where: any = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        brand: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (brand) {
    where.brand = {
      contains: brand,
      mode: 'insensitive',
    };
  }

  if (availability) {
    where.availability = availability;
  }

  if (minPrice || maxPrice) {
    where.pricePerDay = {};

    if (minPrice) {
      where.pricePerDay.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.pricePerDay.lte = Number(maxPrice);
    }
  }

  const gears = await prisma.gear.findMany({
    where,
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return gears;
};

const getSingleGearFromDB = async (id: string) => {
  return prisma.gear.findUniqueOrThrow({
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
};

const updateGearIntoDB = async (
  id: string,
  providerId: string,
  role: Role,
  payload: IUpdateGear
) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // update all
  if (role !== Role.ADMIN && gear.providerId !== providerId) {
    throw new Error('You are not authorized to update this gear.');
  }

  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: {
        id: payload.categoryId,
      },
    });
  }

  const updateData: IUpdateGear = {
    ...payload,
  };

  if (payload.stock !== undefined) {
    updateData.availability = payload.stock > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK';
  }

  const updatedGear = await prisma.gear.update({
    where: {
      id,
    },
    data: updateData,
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

const deleteGearFromDB = async (id: string, providerId: string, role: Role) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id,
    },
  });

  //delete all
  if (role !== Role.ADMIN && gear.providerId !== providerId) {
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
