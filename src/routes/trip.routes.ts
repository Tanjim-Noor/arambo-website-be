import express from 'express';
import { 
  createTrip, 
  getTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip, 
  getTripsByTruck, 
  getTripsByDate, 
  getTripsByTimeSlot 
} from '../controllers/trip.controller';
import { requireApiKey } from '../middlewares/auth.middleware';

const router = express.Router();

// Public endpoints (for users to view available trips/schedules)
router.get('/', getTrips);
router.get('/date', getTripsByDate); // GET /trips/date?date=2023-12-25
router.get('/truck/:truckId', getTripsByTruck);
router.get('/timeslot/:timeSlot', getTripsByTimeSlot);
router.get('/:id', getTripById);

// Private endpoints (require API key)
router.post('/', requireApiKey, createTrip);
router.put('/:id', requireApiKey, updateTrip);
router.delete('/:id', requireApiKey, deleteTrip);

export default router;