import { z } from 'zod';

export const createRentalSchema = z.object({
  gearId: z.uuid({
    error: 'Invalid Gear ID',
  }),

  startDate: z.iso.datetime({
    error: 'Start date must be a valid ISO date',
  }),

  endDate: z.iso.datetime({
    error: 'End date must be a valid ISO date',
  }),
});

export const updateRentalStatusSchema = z.object({
  status: z.enum([
    'PLACED',
    'CONFIRMED',
    'PAID',
    'PICKED_UP',
    'RETURNED',
    'CANCELLED',
  ]),
});
