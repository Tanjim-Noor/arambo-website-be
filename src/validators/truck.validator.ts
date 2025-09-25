import { z } from 'zod';

// Schema for creating a new truck
export const createTruckSchema = z.object({
  modelNumber: z.string()
    .min(1, 'Model number is required')
    .max(100, 'Model number must be less than 100 characters')
    .trim(),
  height: z.number()
    .min(1, 'Height must be greater than 0')
    .max(100, 'Height seems unrealistic'),
  isOpen: z.boolean()
});

// Schema for updating a truck
export const updateTruckSchema = createTruckSchema.partial();

// Schema for getting truck by ID from request body
export const getTruckByIdSchema = z.object({
  id: z.string()
    .min(1, 'Truck ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid truck ID format')
});

// Types
export type CreateTruckRequest = z.infer<typeof createTruckSchema>;
export type UpdateTruckRequest = z.infer<typeof updateTruckSchema>;
export type GetTruckByIdRequest = z.infer<typeof getTruckByIdSchema>;