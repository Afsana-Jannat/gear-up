import { Router } from 'express';
import { Role } from '../../../generated/prisma';
import { auth } from '../../middlewares/auth';
import { providerController } from './provider.controller';

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
