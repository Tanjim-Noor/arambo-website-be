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

const router = express.Router();

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/date', getTripsByDate); // GET /trips/date?date=2023-12-25
router.get('/truck/:truckId', getTripsByTruck);
router.get('/timeslot/:timeSlot', getTripsByTimeSlot);
router.get('/:id', getTripById);
router.put('/', updateTrip);
router.delete('/', deleteTrip);

export default router;