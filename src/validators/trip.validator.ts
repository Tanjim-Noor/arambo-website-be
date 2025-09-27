import { z } from 'zod';

// Define the product type enum
export const ProductTypeEnum = z.enum(['Perishable Goods', 'Non-Perishable Goods', 'Fragile', 'Other'], {
  message: 'Product type must be one of: Perishable Goods, Non-Perishable Goods, Fragile, or Other'
});

// Define the time slot enum
export const TimeSlotEnum = z.enum(['Morning (8AM - 12PM)', 'Afternoon (12PM - 4PM)', 'Evening (4PM - 8PM)'], {
  message: 'Time slot must be one of: Morning (8AM - 12PM), Afternoon (12PM - 4PM), or Evening (4PM - 8PM)'
});

// Schema for creating a new trip
export const createTripSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .trim(),
  email: z.string()
    .email('Please enter a valid email')
    .toLowerCase()
    .trim(),
  productType: ProductTypeEnum,
  pickupLocation: z.string()
    .min(1, 'Pickup location is required')
    .max(300, 'Pickup location must be less than 300 characters')
    .trim(),
  dropOffLocation: z.string()
    .min(1, 'Drop-off location is required')
    .max(200, 'Drop-off location must be less than 200 characters')
    .trim(),
  preferredDate: z.string()
    .pipe(z.coerce.date()),
  preferredTimeSlot: TimeSlotEnum,
  additionalNotes: z.string()
    .max(300, 'Additional notes must be less than 300 characters')
    .trim()
    .optional(),
  truck: z.string()
    .trim()
    .optional(),
  truckId: z.string()
    .min(1, 'Truck ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid truck ID format')
});

// Schema for updating a trip
export const updateTripSchema = createTripSchema.partial();

// Schema for getting trip by ID from request body
export const getTripByIdSchema = z.object({
  id: z.string()
    .min(1, 'Trip ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid trip ID format')
});

// Types
export type CreateTripRequest = z.infer<typeof createTripSchema>;
export type UpdateTripRequest = z.infer<typeof updateTripSchema>;
export type GetTripByIdRequest = z.infer<typeof getTripByIdSchema>;
export type ProductType = z.infer<typeof ProductTypeEnum>;
export type TimeSlot = z.infer<typeof TimeSlotEnum>;