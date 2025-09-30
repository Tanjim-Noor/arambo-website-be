import express from 'express';
import { createTruck, getTrucks, getTruckById, getTruckByIdFromBody, updateTruck, deleteTruck } from '../controllers/truck.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Public truck endpoints (no auth required)
router.get('/', getTrucks);
router.get('/:id', getTruckById);
router.post('/get-by-id', getTruckByIdFromBody);
router.post('/', createTruck);

// Protected truck management endpoints (authentication required)
router.put('/:id', authenticateToken, updateTruck);
router.delete('/:id', authenticateToken, deleteTruck);

export default router;