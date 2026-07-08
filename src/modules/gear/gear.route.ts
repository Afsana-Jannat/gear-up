import { Router } from 'express';
import { gearController } from './gear.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = Router();

// Public Routes
router.get('/', gearController.getAllGear);
router.get('/:id', gearController.getSingleGear);

// Provider/Admin Routes
router.post('/', auth(Role.PROVIDER, Role.ADMIN), gearController.createGear);

router.patch(
  '/:id',
  auth(Role.PROVIDER, Role.ADMIN),
  gearController.updateGear
);

router.delete(
  '/:id',
  auth(Role.PROVIDER, Role.ADMIN),
  gearController.deleteGear
);

export const gearRoutes = router;
