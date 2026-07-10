import { z } from 'zod';

export const createGearSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(2),
  description: z.string().min(5),
  pricePerDay: z.number().positive(),
  stock: z.number().int().nonnegative(),
  image: z.string().url().optional(),
  categoryId: z.string().uuid(),
});

export const updateGearSchema = createGearSchema.partial();
