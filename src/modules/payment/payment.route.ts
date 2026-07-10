import { Router } from 'express';
import { Role } from '../../../generated/prisma';
import { auth } from '../../middlewares/auth';
import { paymentController } from './payment.controller';
import { validateRequest } from '../../middlewares/validateRequests';
import { createPaymentSchema } from '../../validations/payment.validation';

const router = Router();

router.post(
  '/create',
  auth(Role.CUSTOMER),
  validateRequest(createPaymentSchema),
  paymentController.createPayment
);

router.get('/success', paymentController.paymentSuccess);

router.get('/cancel', paymentController.paymentCancel);

router.get('/', auth(Role.CUSTOMER), paymentController.getMyPayments);

router.get('/:id', auth(Role.CUSTOMER), paymentController.getSinglePayment);

export const paymentRoutes = router;
