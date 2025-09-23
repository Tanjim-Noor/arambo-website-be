import { Trip, ITrip } from '../database/models/trip.model';

export class TripService {
  static async createTrip(data: {
    name: string;
    phone: string;
    email: string;
    productType: string;
    pickupLocation: string;
    dropOffLocation: string;
    preferredDate: Date;
    preferredTimeSlot: string;
    additionalNotes?: string;
    truckId: string;
  }): Promise<ITrip> {
    const trip = new Trip(data);
    return await trip.save();
  }

  static async getTrips(): Promise<ITrip[]> {
    return await Trip.find().populate('truck');
  }

  static async getTripById(id: string): Promise<ITrip | null> {
    return await Trip.findById(id).populate('truck');
  }

  static async updateTrip(
    id: string,
    data: Partial<{
      name: string;
      phone: string;
      email: string;
      productType: string;
      pickupLocation: string;
      dropOffLocation: string;
      preferredDate: Date;
      preferredTimeSlot: string;
      additionalNotes: string;
      truckId: string;
    }>
  ): Promise<ITrip | null> {
    // Filter out undefined/null values and only update existing fields
    const updateData: any = {};
    
    // Only allow updating fields that exist in the schema
    const allowedFields = ['name', 'phone', 'email', 'productType', 'pickupLocation', 'dropOffLocation', 'preferredDate', 'preferredTimeSlot', 'additionalNotes', 'truckId'];
    
    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key) && data[key as keyof typeof data] !== undefined && data[key as keyof typeof data] !== null) {
        updateData[key] = data[key as keyof typeof data];
      }
    });
    
    // Return null if no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return null;
    }
    
    return await Trip.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { 
        new: true, 
        runValidators: true,
        upsert: false // Prevent creating new documents
      }
    ).populate('truck');
  }

  static async deleteTrip(id: string): Promise<ITrip | null> {
    return await Trip.findByIdAndDelete(id);
  }

  static async getTripsByTruck(truckId: string): Promise<ITrip[]> {
    return await Trip.find({ truckId }).populate('truck');
  }

  static async getTripsByDate(date: Date): Promise<ITrip[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Trip.find({
      preferredDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate('truck');
  }

  static async getTripsByTimeSlot(timeSlot: string): Promise<ITrip[]> {
    return await Trip.find({ preferredTimeSlot: timeSlot }).populate('truck');
  }
}

// Export individual functions for backward compatibility
export const createTrip = TripService.createTrip.bind(TripService);
export const getTrips = TripService.getTrips.bind(TripService);
export const getTripById = TripService.getTripById.bind(TripService);
export const updateTrip = TripService.updateTrip.bind(TripService);
export const deleteTrip = TripService.deleteTrip.bind(TripService);
export const getTripsByTruck = TripService.getTripsByTruck.bind(TripService);
export const getTripsByDate = TripService.getTripsByDate.bind(TripService);
export const getTripsByTimeSlot = TripService.getTripsByTimeSlot.bind(TripService);