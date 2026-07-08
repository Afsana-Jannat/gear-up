import { Router } from 'express';
import { reviewController } from './review.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = Router();

router.post('/', auth(Role.CUSTOMER), reviewController.createReview);

router.get('/gear/:id', reviewController.getReviewsByGear);

export const reviewRoutes = router;
