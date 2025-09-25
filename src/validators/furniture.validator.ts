import { z } from 'zod';
import { PAGINATION } from '../config/constant';

// Furniture Type enum
export const FurnitureTypeEnum = z.enum([
  'Commercial Furniture',
  'Residential Furniture',
]);

// Payment Type enum
export const PaymentTypeEnum = z.enum([
  'EMI Plan',
  'Lease',
  'Instant Pay',
]);

// Furniture Condition enum
export const FurnitureConditionEnum = z.enum([
  'New Furniture',
  'Used Furniture',
]);

// Extract types from enums
export type FurnitureType = z.infer<typeof FurnitureTypeEnum>;
export type PaymentType = z.infer<typeof PaymentTypeEnum>;
export type FurnitureCondition = z.infer<typeof FurnitureConditionEnum>;

// Base furniture schema
export const FurnitureSchema = z.object({
  name: z.string().min(1, 'Contact name is required').max(100),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  furnitureType: FurnitureTypeEnum,
  paymentType: PaymentTypeEnum.optional(),
  furnitureCondition: FurnitureConditionEnum.optional(),
});

// Create furniture request schema
export const CreateFurnitureRequestSchema = FurnitureSchema;

// Update furniture request schema (all fields optional except for validation)
export const UpdateFurnitureRequestSchema = FurnitureSchema.partial();

// Furniture filters schema
export const FurnitureFiltersSchema = z.object({
  page: z.number().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.number().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
  sortBy: z.enum(['createdAt', 'name', 'furnitureType']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Response schemas
export const FurnitureResponseSchema = FurnitureSchema.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PaginationMetaSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const FurnitureListResponseSchema = z.object({
  data: z.array(FurnitureResponseSchema),
  meta: PaginationMetaSchema,
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
});

// Extract TypeScript types
export type Furniture = z.infer<typeof FurnitureSchema>;
export type CreateFurnitureRequest = z.infer<typeof CreateFurnitureRequestSchema>;
export type UpdateFurnitureRequest = z.infer<typeof UpdateFurnitureRequestSchema>;
export type FurnitureFilters = z.infer<typeof FurnitureFiltersSchema>;
export type FurnitureResponse = z.infer<typeof FurnitureResponseSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type FurnitureListResponse = z.infer<typeof FurnitureListResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;