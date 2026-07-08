import { Router } from 'express';
import { userController } from './user.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = Router();

router.post('/register', userController.registerUser);

router.get(
  '/me',
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  userController.getMyProfile
);

router.patch(
  '/me',
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  userController.updateMyProfile
);

export const userRoutes = router;
