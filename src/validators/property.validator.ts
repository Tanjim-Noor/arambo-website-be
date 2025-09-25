import { z } from 'zod';
import { PAGINATION } from '../config/constant';

// Listing Type enum (formerly PropertyType)
export const ListingTypeEnum = z.enum([
  'For Rent',
  'For Sale',
]);

// Property Type enum (new field)
export const PropertyTypeEnum = z.enum([
  'Apartment',
  'House',
  'Villa',
]);

// Category enum
export const CategoryEnum = z.enum([
  'Furnished',
  'Semi-Furnished',
  'Non-Furnished'
]);

// New enums for the additional fields
export const InventoryStatusEnum = z.enum([
  'Looking for Rent',
  'Found Tenant',
  'Owner Unreachable'
]);

export const TenantTypeEnum = z.enum([
  'Family',
  'Bachelor',
  'Women'
]);

export const PropertyCategoryEnum = z.enum([
  'Residential',
  'Commercial'
]);

export const FurnishingStatusEnum = z.enum([
  'Non-Furnished',
  'Semi-Furnished',
  'Furnished'
]);

// Area enum with areas from CSV data
export const AreaEnum = z.enum([
  'Aftabnagar',
  'Banani',
  'Banani DOHs',
  'Banashree',
  'Banasree',
  'Baridhara DOHs',
  'Baridhara J Block',
  'Bashundhara Residential',
  'Dhanmondi',
  'DIT & Merul Badda',
  'Greenroad',
  'Gudaraghat',
  'Gulshan 1',
  'Gulshan 2',
  'Lalmatia',
  'Middle Badda',
  'Mirpur DOHs',
  'Mohakhali Amtoli',
  'Mohakhali DOHs',
  'Mohakhali TB Gate',
  'Mohakhali Wireless',
  'Mohanagar Project',
  'Niketan',
  'Nikunja 1',
  'Nikunja 2',
  'North Badda',
  'Notun Bazar',
  'Shahjadpur Beside & near Suvastu',
  'Shahjadpur Lakeside',
  'Shanti Niketan',
  'South Badda',
  'South Banasree',
  'Uttara Sector 1',
  'Uttara Sector 2',
  'Uttara Sector 3',
  'Uttara Sector 4',
  'Uttara Sector 5',
  'Uttara Sector 6',
  'Uttara Sector 7',
  'Uttara Sector 8',
  'Uttara Sector 9',
  'Uttara Sector 10',
  'Uttara Sector 11',
  'Uttara Sector 12',
  'Uttara Sector 13',
  'Uttara Sector 14',
  'Uttara Sector 15',
  'Uttara Sector 16',
  'Uttara Sector 17',
  'Uttara Sector 18'
]);

// Base property schema with all required fields
export const PropertySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
  propertyName: z.string().min(1, 'Property name is required').max(200, 'Property name must be less than 200 characters'),
  listingType: ListingTypeEnum.optional(),
  propertyType: PropertyTypeEnum.optional(),
  size: z.number().min(1, 'Size must be greater than 0').max(100000, 'Size seems unrealistic'),
  location: z.string().min(1, 'Location is required').max(300, 'Location must be less than 300 characters'),
  bedrooms: z.number().min(0, 'Bedrooms cannot be negative').max(50, 'Too many bedrooms'),
  bathroom: z.number().min(0, 'Bathrooms cannot be negative').max(50, 'Too many bathrooms'),
  baranda: z.number().min(0, 'Baranda cannot be negative').default(0),
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
  area: AreaEnum.optional(),
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
  
  // Facility boolean fields
  cctv: z.boolean().default(false).optional(),
  communityHall: z.boolean().default(false).optional(),
  gym: z.boolean().default(false).optional(),
  masjid: z.boolean().default(false).optional(),
  parking: z.boolean().default(false).optional(),
  petsAllowed: z.boolean().default(false).optional(),
  swimmingPool: z.boolean().default(false).optional(),
  trainedGuard: z.boolean().default(false).optional(),
  
  coverImage: z.string().max(500, 'Cover image URL must be less than 500 characters').optional(),
  otherImages: z.array(z.string()).max(20, 'Cannot have more than 20 images').optional(),
  apartmentType: z.string().max(100, 'Apartment type must be less than 100 characters').optional(),
  isVerified: z.boolean().default(false),
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
  listingType: ListingTypeEnum.optional(),
  propertyType: PropertyTypeEnum.optional(),
  
  // Enhanced bedroom filter - supports exact (3) or minimum (3+)
  bedrooms: z.string().transform((val) => {
    if (val.endsWith('+')) {
      const num = parseInt(val.slice(0, -1), 10);
      return { type: 'min', value: num };
    }
    const num = parseInt(val, 10);
    return { type: 'exact', value: num };
  }).optional(),
  
  // Enhanced bathroom filter - supports exact (2) or minimum (2+)
  bathroom: z.string().transform((val) => {
    if (val.endsWith('+')) {
      const num = parseInt(val.slice(0, -1), 10);
      return { type: 'min', value: num };
    }
    const num = parseInt(val, 10);
    return { type: 'exact', value: num };
  }).optional(),
  
  minSize: z.string().transform((val) => parseInt(val, 10)).optional(),
  maxSize: z.string().transform((val) => parseInt(val, 10)).optional(),
  location: z.string().optional(),
  firstOwner: z.string().transform((val) => val === 'true').optional(),
  onLoan: z.string().transform((val) => val === 'true').optional(),
  isConfirmed: z.string().transform((val) => val === 'true').optional(),
  
  // New filter fields
  area: AreaEnum.optional(),
  inventoryStatus: InventoryStatusEnum.optional(),
  tenantType: TenantTypeEnum.optional(),
  propertyCategory: PropertyCategoryEnum.optional(),
  furnishingStatus: FurnishingStatusEnum.optional(),
  minRent: z.string().transform((val) => parseInt(val, 10)).optional(),
  maxRent: z.string().transform((val) => parseInt(val, 10)).optional(),
  floor: z.string().transform((val) => parseInt(val, 10)).optional(),
  houseId: z.string().optional(),
  listingId: z.string().optional(),
  apartmentType: z.string().optional(),
  isVerified: z.string().transform((val) => val === 'true').optional(),
  
  // Facility filter fields
  cctv: z.string().transform((val) => val === 'true').optional(),
  communityHall: z.string().transform((val) => val === 'true').optional(),
  gym: z.string().transform((val) => val === 'true').optional(),
  masjid: z.string().transform((val) => val === 'true').optional(),
  parking: z.string().transform((val) => val === 'true').optional(),
  petsAllowed: z.string().transform((val) => val === 'true').optional(),
  swimmingPool: z.string().transform((val) => val === 'true').optional(),
  trainedGuard: z.string().transform((val) => val === 'true').optional(),
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
export type ListingType = z.infer<typeof ListingTypeEnum>;
export type Category = z.infer<typeof CategoryEnum>;
export type InventoryStatus = z.infer<typeof InventoryStatusEnum>;
export type TenantType = z.infer<typeof TenantTypeEnum>;
export type PropertyCategory = z.infer<typeof PropertyCategoryEnum>;
export type FurnishingStatus = z.infer<typeof FurnishingStatusEnum>;
export type Area = z.infer<typeof AreaEnum>;