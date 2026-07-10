import { Router } from 'express';
import { categoryController } from './category.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';
import { validateRequest } from '../../middlewares/validateRequests';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../validations/category.validation';

const router = Router();

// Public
router.get('/', categoryController.getAllCategories);

// Admin Only
router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(createCategorySchema),
  categoryController.createCategory
);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(updateCategorySchema),
  categoryController.updateCategory
);
router.delete('/:id', auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
