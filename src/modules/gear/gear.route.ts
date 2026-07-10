import { Router } from 'express';
import { gearController } from './gear.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';
import { validateRequest } from '../../middlewares/validateRequests';
import {
  createGearSchema,
  updateGearSchema,
} from '../../validations/gear.validation';

const router = Router();

// Public Routes
router.get('/', gearController.getAllGear);
router.get('/:id', gearController.getSingleGear);

// Provider/Admin Routes
router.post(
  '/',
  auth(Role.PROVIDER, Role.ADMIN),
  validateRequest(createGearSchema),
  gearController.createGear
);

router.patch(
  '/:id',
  auth(Role.PROVIDER, Role.ADMIN),
  validateRequest(updateGearSchema),
  gearController.updateGear
);

router.delete(
  '/:id',
  auth(Role.PROVIDER, Role.ADMIN),
  gearController.deleteGear
);

export const gearRoutes = router;
