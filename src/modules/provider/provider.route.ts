import { Router } from 'express';
import { Role } from '@prisma/client';
import { auth } from '../../middlewares/auth.js';
import { providerController } from './provider.controller.js';

const router = Router();

router.get(
  '/orders',
  auth(Role.PROVIDER),
  providerController.getProviderOrders
);

router.patch(
  '/orders/:id',
  auth(Role.PROVIDER),
  providerController.updateProviderOrderStatus
);

export const providerRoutes = router;
