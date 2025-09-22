import { z } from 'zod';
import { PAGINATION } from '../config/constant';

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

// New enums for the additional fields
export const InventoryStatusEnum = z.enum([
  'Looking for Rent',
  'Looking for Sale', 
  'Looking for Lease',
  'Available',
  'Rented',
  'Sold',
  'Leased',
  'Unavailable'
]);

export const TenantTypeEnum = z.enum([
  'Family',
  'Bachelor', 
  'Office',
  'Commercial',
  'Any'
]);

export const PropertyCategoryEnum = z.enum([
  'Residential',
  'Commercial',
  'Industrial',
  'Mixed'
]);

export const FurnishingStatusEnum = z.enum([
  'Furnished',
  'Semi-Furnished',
  'Non-Furnished'
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
  isConfirmed: z.boolean().default(false),
  paperworkUpdated: z.boolean().default(false),
  onLoan: z.boolean().default(false),
  
  // New optional fields
  houseId: z.string().max(50, 'House ID must be less than 50 characters').optional(),
  streetAddress: z.string().max(500, 'Street address must be less than 500 characters').optional(),
  landmark: z.string().max(300, 'Landmark must be less than 300 characters').optional(),
  area: z.string().max(200, 'Area must be less than 200 characters').optional(),
  listingId: z.string().max(50, 'Listing ID must be less than 50 characters').optional(),
  inventoryStatus: InventoryStatusEnum.optional(),
  tenantType: TenantTypeEnum.optional(),
  propertyCategory: PropertyCategoryEnum.optional(),
  furnishingStatus: FurnishingStatusEnum.optional(),
  availableFrom: z.coerce.date().optional(),
  floor: z.number().min(0, 'Floor cannot be negative').max(200, 'Floor seems unrealistic').optional(),
  totalFloor: z.number().min(1, 'Total floor must be at least 1').max(200, 'Total floor seems unrealistic').optional(),
  yearOfConstruction: z.number().min(1800, 'Year of construction seems too old').max(new Date().getFullYear() + 5, 'Year of construction cannot be too far in future').optional(),
  rent: z.number().min(0, 'Rent cannot be negative').max(10000000, 'Rent seems unrealistic').optional(),
  serviceCharge: z.number().min(0, 'Service charge cannot be negative').max(1000000, 'Service charge seems unrealistic').optional(),
  advanceMonths: z.number().min(0, 'Advance months cannot be negative').max(24, 'Advance months seems too high').optional(),
  cleanHygieneScore: z.number().min(1, 'Clean hygiene score must be between 1-10').max(10, 'Clean hygiene score must be between 1-10').optional(),
  sunlightScore: z.number().min(1, 'Sunlight score must be between 1-10').max(10, 'Sunlight score must be between 1-10').optional(),
  bathroomConditionsScore: z.number().min(1, 'Bathroom conditions score must be between 1-10').max(10, 'Bathroom conditions score must be between 1-10').optional(),
  coverImage: z.string().max(500, 'Cover image URL must be less than 500 characters').optional(),
  otherImages: z.array(z.string()).max(20, 'Cannot have more than 20 images').optional(),
});

// Create property request schema (for POST requests)
export const CreatePropertyRequestSchema = PropertySchema;

// Update property request schema (for PATCH requests) - all fields optional
export const UpdatePropertyRequestSchema = PropertySchema.partial();

// Query filters schema (for GET requests)
export const PropertyFiltersSchema = z.object({
  // Pagination parameters
  page: z.string().transform((val) => Math.max(1, parseInt(val, 10)) || PAGINATION.DEFAULT_PAGE).optional(),
  limit: z.string().transform((val) => Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(val, 10))) || PAGINATION.DEFAULT_LIMIT).optional(),
  
  // Filter parameters
  category: CategoryEnum.optional(),
  propertyType: PropertyTypeEnum.optional(),
  bedrooms: z.string().transform((val) => parseInt(val, 10)).optional(),
  minSize: z.string().transform((val) => parseInt(val, 10)).optional(),
  maxSize: z.string().transform((val) => parseInt(val, 10)).optional(),
  location: z.string().optional(),
  firstOwner: z.string().transform((val) => val === 'true').optional(),
  onLoan: z.string().transform((val) => val === 'true').optional(),
  isConfirmed: z.string().transform((val) => val === 'true').optional(),
  
  // New filter fields
  area: z.string().optional(),
  inventoryStatus: InventoryStatusEnum.optional(),
  tenantType: TenantTypeEnum.optional(),
  propertyCategory: PropertyCategoryEnum.optional(),
  furnishingStatus: FurnishingStatusEnum.optional(),
  minRent: z.string().transform((val) => parseInt(val, 10)).optional(),
  maxRent: z.string().transform((val) => parseInt(val, 10)).optional(),
  floor: z.string().transform((val) => parseInt(val, 10)).optional(),
  houseId: z.string().optional(),
  listingId: z.string().optional(),
});

// Response schemas
export const PropertyResponseSchema = PropertySchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Pagination metadata schema
export const PaginationMetaSchema = z.object({
  currentPage: z.number(),
  limit: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
  nextPage: z.number().optional(),
  prevPage: z.number().optional(),
});

export const PropertiesListResponseSchema = z.object({
  properties: z.array(PropertyResponseSchema),
  total: z.number(), // For backward compatibility
  pagination: PaginationMetaSchema,
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
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type PropertiesListResponse = z.infer<typeof PropertiesListResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type PropertyType = z.infer<typeof PropertyTypeEnum>;
export type Category = z.infer<typeof CategoryEnum>;
export type InventoryStatus = z.infer<typeof InventoryStatusEnum>;
export type TenantType = z.infer<typeof TenantTypeEnum>;
export type PropertyCategory = z.infer<typeof PropertyCategoryEnum>;
export type FurnishingStatus = z.infer<typeof FurnishingStatusEnum>;