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
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Public trip endpoints (no auth required)
router.get('/', getTrips);
router.get('/date', getTripsByDate); // GET /trips/date?date=2023-12-25
router.get('/truck/:truckId', getTripsByTruck);
router.get('/timeslot/:timeSlot', getTripsByTimeSlot);
router.get('/:id', getTripById);
router.post('/', createTrip);

// Protected trip management endpoints (authentication required)
router.put('/:id', authenticateToken, updateTrip);
router.delete('/:id', authenticateToken, deleteTrip);

export default router;