import { prisma } from '../../lib/prisma';
import { ICreateCategory, IUpdateCategory } from './category.interface';

const createCategoryIntoDB = async (payload: ICreateCategory) => {
  const isExist = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isExist) {
    throw new Error('Category already exists.');
  }

  const category = await prisma.category.create({
    data: payload,
  });

  return category;
};

const getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return categories;
};

const updateCategoryIntoDB = async (id: string, payload: IUpdateCategory) => {
  await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  const category = await prisma.category.update({
    where: { id },
    data: payload,
  });

  return category;
};

const deleteCategoryFromDB = async (id: string) => {
  await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  await prisma.category.delete({
    where: { id },
  });

  return null;
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
