import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { auth } from '../../middlewares/auth.js';
import { Role } from '@prisma/client';
import { validateRequest } from '../../middlewares/validateRequests.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../validations/category.validation.js';

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
