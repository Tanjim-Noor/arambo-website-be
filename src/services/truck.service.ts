import { Truck, ITruck } from '../database/models/truck.model';

export class TruckService {
  static async createTruck(data: { modelNumber: string; height: number; isOpen: boolean; truck?: string }): Promise<ITruck> {
    const truck = new Truck(data);
    return await truck.save();
  }

  static async getTrucks(): Promise<ITruck[]> {
    return await Truck.find();
  }

  static async getTruckById(id: string): Promise<ITruck | null> {
    return await Truck.findById(id);
  }

  static async updateTruck(id: string, data: Partial<{ modelNumber: string; height: number; isOpen: boolean; truck: string }>): Promise<ITruck | null> {
    // Filter out undefined/null values and only update existing fields
    const updateData: any = {};
    
    // Only allow updating fields that exist in the schema
    const allowedFields = ['modelNumber', 'height', 'isOpen', 'truck'];
    
    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key) && data[key as keyof typeof data] !== undefined && data[key as keyof typeof data] !== null) {
        updateData[key] = data[key as keyof typeof data];
      }
    });
    
    // Return null if no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return null;
    }
    
    return await Truck.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { 
        new: true, 
        runValidators: true,
        upsert: false // Prevent creating new documents
      }
    );
  }

  static async deleteTruck(id: string): Promise<ITruck | null> {
    return await Truck.findByIdAndDelete(id);
  }
}