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

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Furniture statistics endpoint
router.get('/stats', getFurnitureStatistics);

// Furniture CRUD endpoints
router.post('/', createFurnitureItem);
router.get('/', getFurnitureItems);
router.get('/:id', getFurnitureItem);
router.put('/:id', updateFurnitureItem);
router.delete('/:id', deleteFurnitureItem);

export default router;