import { Router } from 'express';
import {
  createItem,
  getAllItems,
  getItemsByCategory,
  getItemsBySubcategory,
  getItemById,
  getItemByName,
  searchItemsByName,
  updateItem,
} from '../controllers/itemController.js';

const router = Router();

// ITEM
router.post('/', createItem);
router.get('/', getAllItems);
router.get('/category/:categoryId', getItemsByCategory);
router.get('/subcategory/:subcategoryId', getItemsBySubcategory);
router.get('/name/:name', getItemByName);
router.get('/search/:name', searchItemsByName);
router.get('/:id', getItemById);
router.put('/:id', updateItem);

export default router;
