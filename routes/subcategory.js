import { Router } from 'express';
import {
  createSubcategory,
  getAllSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryById,
  getSubcategoryByName,
  updateSubcategory,
} from '../controllers/subcategoryController.js';

const router = Router();

// SUBCATEGORY
router.post('/', createSubcategory);
router.get('/', getAllSubcategories);
router.get('/category/:categoryId', getSubcategoriesByCategory);
router.get('/name/:name', getSubcategoryByName);
router.get('/:id', getSubcategoryById);
router.put('/:id', updateSubcategory);

export default router;
