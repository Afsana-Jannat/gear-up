import { Router } from 'express';
import { rentalController } from './rental.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';
import {
  createRentalSchema,
  updateRentalStatusSchema,
} from '../../validations/rental.validation';
import { validateRequest } from '../../middlewares/validateRequests';

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
