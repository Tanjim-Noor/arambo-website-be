import { z } from 'zod';

// Property Type enum
export const PropertyTypeEnum = z.enum([
  'apartment',
  'house',
  'villa',
  'townhouse',
  'studio',
  'duplex',
  'penthouse',
  'commercial',
  'land',
  'other'
]);

// Category enum
export const CategoryEnum = z.enum([
  'sale',
  'rent',
  'lease',
  'buy'
]);

// Base property schema with all required fields
export const PropertySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
  propertyName: z.string().min(1, 'Property name is required').max(200, 'Property name must be less than 200 characters'),
  propertyType: PropertyTypeEnum,
  size: z.number().min(1, 'Size must be greater than 0').max(100000, 'Size seems unrealistic'),
  location: z.string().min(1, 'Location is required').max(300, 'Location must be less than 300 characters'),
  bedrooms: z.number().min(0, 'Bedrooms cannot be negative').max(50, 'Too many bedrooms'),
  bathroom: z.number().min(0, 'Bathrooms cannot be negative').max(50, 'Too many bathrooms'),
  baranda: z.boolean().default(false),
  category: CategoryEnum,
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  firstOwner: z.boolean().default(false),
  lift: z.boolean().default(false),
  paperworkUpdated: z.boolean().default(false),
  onLoan: z.boolean().default(false),
});

// Create property request schema (for POST requests)
export const CreatePropertyRequestSchema = PropertySchema;

// Update property request schema (for PATCH requests) - all fields optional
export const UpdatePropertyRequestSchema = PropertySchema.partial();

// Query filters schema (for GET requests)
export const PropertyFiltersSchema = z.object({
  category: CategoryEnum.optional(),
  propertyType: PropertyTypeEnum.optional(),
  bedrooms: z.string().transform((val) => parseInt(val, 10)).optional(),
  minSize: z.string().transform((val) => parseInt(val, 10)).optional(),
  maxSize: z.string().transform((val) => parseInt(val, 10)).optional(),
  location: z.string().optional(),
  firstOwner: z.string().transform((val) => val === 'true').optional(),
  onLoan: z.string().transform((val) => val === 'true').optional(),
});

// Response schemas
export const PropertyResponseSchema = PropertySchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PropertiesListResponseSchema = z.object({
  properties: z.array(PropertyResponseSchema),
  total: z.number(),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.any().optional(),
});

// Type exports for use in other files
export type Property = z.infer<typeof PropertySchema>;
export type CreatePropertyRequest = z.infer<typeof CreatePropertyRequestSchema>;
export type UpdatePropertyRequest = z.infer<typeof UpdatePropertyRequestSchema>;
export type PropertyFilters = z.infer<typeof PropertyFiltersSchema>;
export type PropertyResponse = z.infer<typeof PropertyResponseSchema>;
export type PropertiesListResponse = z.infer<typeof PropertiesListResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type PropertyType = z.infer<typeof PropertyTypeEnum>;
export type Category = z.infer<typeof CategoryEnum>;