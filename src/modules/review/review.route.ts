import { Router } from 'express';
import { reviewController } from './review.controller.js';
import { auth } from '../../middlewares/auth.js';
import { Role } from '../../../generated/prisma';
import { validateRequest } from '../../middlewares/validateRequests.js';
import { createReviewSchema } from '../../validations/review.validation.js';

const router = Router();

router.post(
  '/',
  auth(Role.CUSTOMER),
  validateRequest(createReviewSchema),
  reviewController.createReview
);

router.get('/gear/:id', reviewController.getReviewsByGear);

export const reviewRoutes = router;
