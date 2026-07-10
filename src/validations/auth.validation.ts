import { z } from 'zod';
import { Role } from '../../generated/prisma';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),

  email: z.email('Invalid email address'),

  password: z.string().min(6, 'Password must be at least 6 characters'),

  phone: z.string().optional(),

  address: z.string().optional(),

  avatar: z.string().url().optional(),

  role: z.enum(Role),
});

export const loginSchema = z.object({
  email: z.email('Invalid email address'),

  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().url().optional(),
});
