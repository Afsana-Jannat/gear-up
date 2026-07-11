import { Router } from 'express';
import { userController } from './user.controller.js';
import { auth } from '../../middlewares/auth.js';
import { Role } from '@prisma/client';
import {
  registerSchema,
  updateProfileSchema,
} from '../../validations/auth.validation.js';
import { validateRequest } from '../../middlewares/validateRequests.js';

const router = Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  userController.registerUser
);

router.get(
  '/me',
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  userController.getMyProfile
);

router.patch(
  '/me',
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  validateRequest(updateProfileSchema),
  userController.updateMyProfile
);

export const userRoutes = router;
