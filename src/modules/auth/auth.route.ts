import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequests';
import { loginSchema } from '../../validations/auth.validation';

const router = Router();

router.post('/login', validateRequest(loginSchema), authController.loginUser);

router.post('/refresh-token', authController.refreshToken);

router.post('/logout', authController.logoutUser);

export const authRoutes = router;
