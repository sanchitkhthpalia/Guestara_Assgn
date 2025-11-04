import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory,
} from '../controllers/categoryController.js';

const router = Router();

// CATEGORY
router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/name/:name', getCategoryByName);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);

export default router;
