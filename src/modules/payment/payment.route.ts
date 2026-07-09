import { Router } from 'express';
import { Role } from '../../../generated/prisma';
import { auth } from '../../middlewares/auth';
import { paymentController } from './payment.controller';

const router = Router();

router.post('/create', auth(Role.CUSTOMER), paymentController.createPayment);

router.patch(
  '/confirm/:id',
  auth(Role.ADMIN),
  paymentController.confirmPayment
);

router.get('/', auth(Role.CUSTOMER), paymentController.getMyPayments);

router.get('/:id', auth(Role.CUSTOMER), paymentController.getSinglePayment);

export const paymentRoutes = router;
