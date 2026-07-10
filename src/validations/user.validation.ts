import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),

  phone: z
    .string()
    .min(11, 'Phone number is invalid')
    .max(15, 'Phone number is invalid')
    .optional(),

  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .optional(),

  avatar: z.string().url('Avatar must be a valid URL').optional(),
});
