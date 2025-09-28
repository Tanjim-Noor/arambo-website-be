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

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Property statistics endpoint
router.get('/stats', getPropertyStats);

// Property CRUD endpoints
router.post('/', createProperty);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;