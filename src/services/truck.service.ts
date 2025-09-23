import { Truck, ITruck } from '../database/models/truck.model';

export class TruckService {
  static async createTruck(data: { modelNumber: string; height: number; isOpen: boolean }): Promise<ITruck> {
    const truck = new Truck(data);
    return await truck.save();
  }

  static async getTrucks(): Promise<ITruck[]> {
    return await Truck.find();
  }

  static async getTruckById(id: string): Promise<ITruck | null> {
    return await Truck.findById(id);
  }

  static async updateTruck(id: string, data: Partial<{ modelNumber: string; height: number; isOpen: boolean }>): Promise<ITruck | null> {
    return await Truck.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteTruck(id: string): Promise<ITruck | null> {
    return await Truck.findByIdAndDelete(id);
  }
}