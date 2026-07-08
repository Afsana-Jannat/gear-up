import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import config from '../../config';
import { RegisterUserPayload, UpdateProfilePayload } from './user.interface';

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, phone, address, avatar, role } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error('User already exists with this email.');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      avatar,
      role,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
};

const updateMyProfileInDB = async (
  userId: string,
  payload: UpdateProfilePayload
) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
