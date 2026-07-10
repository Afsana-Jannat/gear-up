import { z } from 'zod';

export const createReviewSchema = z.object({
  rentalOrderId: z.string().uuid('Invalid Rental Order ID'),

  gearId: z.string().uuid('Invalid Gear ID'),

  rating: z
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),

  comment: z
    .string()
    .max(500, 'Comment cannot exceed 500 characters')
    .optional(),
});
