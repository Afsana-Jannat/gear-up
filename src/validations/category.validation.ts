import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name cannot exceed 50 characters'),

  description: z
    .string()
    .trim()
    .min(5, 'Description must be at least 5 characters')
    .max(255, 'Description cannot exceed 255 characters'),
});

export const updateCategorySchema = createCategorySchema.partial();
