import { Router } from 'express';
import { userController } from './user.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';
import {
  registerSchema,
  updateProfileSchema,
} from '../../validations/auth.validation';
import { validateRequest } from '../../middlewares/validateRequests';

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
