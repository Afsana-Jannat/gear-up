import { Router } from 'express';
import { rentalController } from './rental.controller.js';
import { auth } from '../../middlewares/auth.js';
import { Role } from '../../../generated/prisma';
import {
  createRentalSchema,
  updateRentalStatusSchema,
} from '../../validations/rental.validation.js';
import { validateRequest } from '../../middlewares/validateRequests.js';

const router = Router();

// Customer
router.post(
  '/',
  auth(Role.CUSTOMER),
  validateRequest(createRentalSchema),
  rentalController.createRental
);

router.get('/my-orders', auth(Role.CUSTOMER), rentalController.getMyRentals);

// Admin
router.get('/', auth(Role.ADMIN), rentalController.getAllRentals);

router.patch(
  '/:id/status',
  auth(Role.ADMIN),
  validateRequest(updateRentalStatusSchema),
  rentalController.updateRentalStatus
);

export const rentalRoutes = router;
