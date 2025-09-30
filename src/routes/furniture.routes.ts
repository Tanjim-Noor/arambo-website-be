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
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Furniture statistics endpoint
router.get('/stats', getFurnitureStatistics);

// Public furniture endpoints (no auth required)
router.get('/', getFurnitureItems);
router.get('/:id', getFurnitureItem);
router.post('/', createFurnitureItem);

// Protected furniture management endpoints (authentication required)
router.put('/:id', authenticateToken, updateFurnitureItem);
router.delete('/:id', authenticateToken, deleteFurnitureItem);

export default router;