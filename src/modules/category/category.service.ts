// import { prisma } from '../../lib/prisma.js';
// import { ICreateCategory, IUpdateCategory } from './category.interface.js';

// const createCategoryIntoDB = async (payload: ICreateCategory) => {
//   const isExist = await prisma.category.findUnique({
//     where: {
//       name: payload.name,
//     },
//   });

//   if (isExist) {
//     throw new Error('Category already exists.');
//   }

//   const category = await prisma.category.create({
//     data: payload,
//   });

//   return category;
// };

// const getAllCategoriesFromDB = async () => {
//   const categories = await prisma.category.findMany({
//     include: {
//       _count: {
//         select: {
//           gearItems: true,
//         },
//       },
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   return categories.map((category) => ({
//     id: category.id,
//     name: category.name,
//     description: category.description,
//     image: category.image,
//     gearCount: category._count.gearItems,
//   }));
// };

// const updateCategoryIntoDB = async (id: string, payload: IUpdateCategory) => {
//   await prisma.category.findUniqueOrThrow({
//     where: { id },
//   });

//   const category = await prisma.category.update({
//     where: { id },
//     data: payload,
//   });

//   return category;
// };

// const deleteCategoryFromDB = async (id: string) => {
//   await prisma.category.findUniqueOrThrow({
//     where: { id },
//   });

//   await prisma.category.delete({
//     where: { id },
//   });

//   return null;
// };

// export const categoryService = {
//   createCategoryIntoDB,
//   getAllCategoriesFromDB,
//   updateCategoryIntoDB,
//   deleteCategoryFromDB,
// };

import { prisma } from '../../lib/prisma.js';
import { ICreateCategory, IUpdateCategory } from './category.interface.js';

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
    include: {
      _count: {
        select: {
          gearItems: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    gearCount: category._count.gearItems,
  }));
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
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          gearItems: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error('Category not found.');
  }

  if (category._count.gearItems > 0) {
    throw new Error(
      'Cannot delete this category because it contains gear items.'
    );
  }

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
