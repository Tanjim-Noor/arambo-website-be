import { Router } from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  healthCheck,
  getPropertyStats,
} from '../controllers/property.controller';
import { requireApiKey } from '../middlewares/auth.middleware';

const router = Router();

// Public endpoints
router.get('/health', healthCheck);
router.get('/stats', getPropertyStats);
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Private endpoints (require API key)
router.post('/', requireApiKey, createProperty);
router.put('/:id', requireApiKey, updateProperty);

export default router;