import { z } from 'zod';

export const createPaymentSchema = z.object({
  rentalOrderId: z.string().uuid('Invalid Rental Order ID'),
  method: z.enum(['STRIPE']),
});

export const confirmPaymentSchema = z.object({});
