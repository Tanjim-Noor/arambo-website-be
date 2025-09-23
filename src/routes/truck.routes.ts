import express from 'express';
import { createTruck, getTrucks, getTruckByIdFromBody, updateTruck, deleteTruck } from '../controllers/truck.controller';

const router = express.Router();

router.post('/', createTruck);
router.get('/', getTrucks);
router.post('/get-by-id', getTruckByIdFromBody);
router.put('/:id', updateTruck);
router.delete('/:id', deleteTruck);

export default router;