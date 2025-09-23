import express from 'express';
import { createTruck, getTrucks, getTruckById, getTruckByIdFromBody, updateTruck, deleteTruck } from '../controllers/truck.controller';

const router = express.Router();

router.post('/', createTruck);
router.get('/', getTrucks);
router.get('/:id', getTruckById);
router.post('/get-by-id', getTruckByIdFromBody);
router.put('/', updateTruck);
router.delete('/', deleteTruck);

export default router;