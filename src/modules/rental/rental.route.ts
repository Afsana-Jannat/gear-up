import { Router } from 'express';
import { rentalController } from './rental.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = Router();

// Customer
router.post('/', auth(Role.CUSTOMER), rentalController.createRental);

router.get('/my-orders', auth(Role.CUSTOMER), rentalController.getMyRentals);

// Admin
router.get('/', auth(Role.ADMIN), rentalController.getAllRentals);

router.patch(
  '/:id/status',
  auth(Role.ADMIN),
  rentalController.updateRentalStatus
);

export const rentalRoutes = router;
