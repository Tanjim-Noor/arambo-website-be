import { Router } from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  healthCheck,
  getPropertyStats,
} from '../controllers/property.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Property statistics endpoint
router.get('/stats', getPropertyStats);

// Public property endpoints (no auth required)
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', createProperty);

// Protected property management endpoints (authentication required)
router.put('/:id', authenticateToken, updateProperty);
router.delete('/:id', authenticateToken, deleteProperty);

export default router;