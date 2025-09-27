import { Router } from 'express';
import {
  createFurnitureItem,
  getFurnitureItems,
  getFurnitureItem,
  updateFurnitureItem,
  deleteFurnitureItem,
  healthCheck,
  getFurnitureStatistics,
} from '../controllers/furniture.controller';
import { requireApiKey } from '../middlewares/auth.middleware';

const router = Router();

// Public endpoints
router.get('/health', healthCheck);
router.get('/stats', getFurnitureStatistics);
router.get('/', getFurnitureItems);
router.get('/:id', getFurnitureItem);

// Private endpoints (require API key)
router.post('/', requireApiKey, createFurnitureItem);
router.put('/:id', requireApiKey, updateFurnitureItem);
router.delete('/:id', requireApiKey, deleteFurnitureItem);

export default router;