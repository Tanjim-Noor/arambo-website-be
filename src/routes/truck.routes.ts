import express from 'express';
import { createTruck, getTrucks, getTruckById, getTruckByIdFromBody, updateTruck, deleteTruck } from '../controllers/truck.controller';
import { requireApiKey } from '../middlewares/auth.middleware';

const router = express.Router();

// Public endpoints
router.get('/', getTrucks);
router.get('/:id', getTruckById);
router.post('/get-by-id', getTruckByIdFromBody); // Keep public for frontend to fetch truck details

// Private endpoints (require API key)
router.post('/', requireApiKey, createTruck);
router.put('/:id', requireApiKey, updateTruck);
router.delete('/:id', requireApiKey, deleteTruck);

export default router;