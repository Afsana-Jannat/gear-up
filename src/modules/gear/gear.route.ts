import { Router } from 'express';
import { gearController } from './gear.controller.js';
import { auth } from '../../middlewares/auth.js';
import { Role } from '@prisma/client';
import { validateRequest } from '../../middlewares/validateRequests.js';
import {
  createGearSchema,
  updateGearSchema,
} from '../../validations/gear.validation.js';

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
