import { Request, Response } from 'express';
import { TruckService } from '../services/truck.service';
import { getTruckByIdSchema } from '../validators/truck.validator';

export const createTruck = async (req: Request, res: Response) => {
  try {
    const truck = await TruckService.createTruck(req.body);
    res.status(201).json(truck);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create truck', details: err });
  }
};

export const getTrucks = async (_req: Request, res: Response) => {
  try {
    const trucks = await TruckService.getTrucks();
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trucks', details: err });
  }
};

export const getTruckById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Truck id is required' });
    }
    const truck = await TruckService.getTruckById(String(id));
    if (truck) {
      return res.json(truck);
    } else {
      return res.status(404).json({ error: 'Truck not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch truck', details: err });
  }
};


export const getTruckByIdFromBody = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = getTruckByIdSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request body', 
        details: validationResult.error.issues 
      });
    }

    const { id } = validationResult.data;
    const truck = await TruckService.getTruckById(id);
    if (truck) {
      return res.json(truck);
    } else {
      return res.status(404).json({ error: 'Truck not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch truck', details: err });
  }
};

export const updateTruck = async (req: Request, res: Response) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Truck id is required in request body' });
    }
    const truck = await TruckService.updateTruck(String(id), updateData);
    if (truck) return res.json(truck);
    else return res.status(404).json({ error: 'Truck not found' });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update truck', details: err });
  }
};

export const deleteTruck = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Truck id is required in request body' });
    }
    const truck = await TruckService.deleteTruck(String(id));
    if (truck) return res.json({ success: true });
    else return res.status(404).json({ error: 'Truck not found' });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to delete truck', details: err });
  }
};