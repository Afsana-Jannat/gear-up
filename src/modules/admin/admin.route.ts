import { Router } from 'express';
import { Role } from '../../../generated/prisma';
import { auth } from '../../middlewares/auth';
import { adminController } from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequests';
import { updateUserStatusSchema } from '../../validations/admin.validation';

const router = Router();

router.get('/users', auth(Role.ADMIN), adminController.getAllUsers);

router.patch(
  '/users/:id',
  auth(Role.ADMIN),
  validateRequest(updateUserStatusSchema),
  adminController.updateUserStatus
);

router.get('/gear', auth(Role.ADMIN), adminController.getAllGear);

router.get('/rentals', auth(Role.ADMIN), adminController.getAllRentals);

export const adminRoutes = router;
