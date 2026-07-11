import { Router } from 'express';
import { Role } from '../../../generated/prisma';
import { auth } from '../../middlewares/auth.js';
import { adminController } from './admin.controller.js';
import { validateRequest } from '../../middlewares/validateRequests.js';
import { updateUserStatusSchema } from '../../validations/admin.validation.js';

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
