import { Request, Response } from 'express';
import { TripService } from '../services/trip.service';



export const getTrips = async (req: Request, res: Response) => {
  try {
    const trips = await TripService.getTrips();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips', details: err });
  }
};

export const getTripById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Trip id is required' });
    }
    const trip = await TripService.getTripById(String(id));
    if (trip) {
      return res.json(trip);
    } else {
      return res.status(404).json({ error: 'Trip not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trip', details: err });
  }
};

export const createTrip = async (req: Request, res: Response) => {
  try {
    const trip = await TripService.createTrip(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create trip', details: err });
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Trip id is required' });
    }
    const trip = await TripService.updateTrip(String(id), req.body);
    if (trip) {
      return res.json(trip);
    } else {
      return res.status(404).json({ error: 'Trip not found' });
    }
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update trip', details: err });
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Trip id is required' });
    }
    const trip = await TripService.deleteTrip(String(id));
    if (trip) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: 'Trip not found' });
    }
  } catch (err) {
    return res.status(400).json({ error: 'Failed to delete trip', details: err });
  }
};

export const getTripsByTruck = async (req: Request, res: Response) => {
  try {
    const { truckId } = req.params;
    if (!truckId) {
      return res.status(400).json({ error: 'Truck id is required' });
    }
    const trips = await TripService.getTripsByTruck(String(truckId));
    return res.json(trips);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trips by truck', details: err });
  }
};

export const getTripsByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    const trips = await TripService.getTripsByDate(new Date(String(date)));
    return res.json(trips);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trips by date', details: err });
  }
};

export const getTripsByTimeSlot = async (req: Request, res: Response) => {
  try {
    const { timeSlot } = req.params;
    if (!timeSlot) {
      return res.status(400).json({ error: 'Time slot is required' });
    }
    const trips = await TripService.getTripsByTimeSlot(String(timeSlot));
    return res.json(trips);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trips by time slot', details: err });
  }
};