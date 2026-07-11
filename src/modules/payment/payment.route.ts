import { Router } from 'express';
import { Role } from '@prisma/client';
import { auth } from '../../middlewares/auth.js';
import { paymentController } from './payment.controller.js';
import { validateRequest } from '../../middlewares/validateRequests.js';
import { createPaymentSchema } from '../../validations/payment.validation.js';

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
