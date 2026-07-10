import { Router } from 'express';
import { reviewController } from './review.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';
import { validateRequest } from '../../middlewares/validateRequests';
import { createReviewSchema } from '../../validations/review.validation';

const router = Router();

router.post(
  '/',
  auth(Role.CUSTOMER),
  validateRequest(createReviewSchema),
  reviewController.createReview
);

router.get('/gear/:id', reviewController.getReviewsByGear);

export const reviewRoutes = router;
