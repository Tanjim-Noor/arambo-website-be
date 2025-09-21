import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  CreatePropertyRequestSchema,
  UpdatePropertyRequestSchema,
  PropertyFiltersSchema,
  PropertyResponse,
  PropertiesListResponse,
  ErrorResponse,
  Property as PropertyType,
} from '../validators/property.validator';
import {
  createListing,
  queryListings,
  getListingById,
  updateListing,
} from '../services/property.service';

// Create a new property listing
export const createProperty = async (
  req: Request,
  res: Response<PropertyResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = CreatePropertyRequestSchema.parse(req.body);

    // Create listing in database
    const property = await createListing(validatedData);

    res.status(201).json(property);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    console.error('Error creating property:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create property listing',
    });
  }
};

// Get all property listings with optional filters
export const getProperties = async (
  req: Request,
  res: Response<PropertiesListResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate query parameters
    const validatedFilters = PropertyFiltersSchema.parse(req.query);

    // Query listings from Notion
    const result = await queryListings(validatedFilters);

    const response: PropertiesListResponse = {
      properties: result.properties,
      total: result.total,
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid query parameters',
        details: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    console.error('Error fetching properties:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch property listings',
    });
  }
};

// Get a single property by ID
export const getPropertyById = async (
  req: Request,
  res: Response<PropertyResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Property ID is required',
      });
      return;
    }

    const property = await getListingById(id);

    if (!property) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Property not found',
      });
      return;
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch property',
    });
  }
};

// Update a property listing
export const updateProperty = async (
  req: Request,
  res: Response<PropertyResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Property ID is required',
      });
      return;
    }

    // Validate request body (partial validation for updates)
    const validatedData = UpdatePropertyRequestSchema.parse(req.body);

    // Filter out undefined values to satisfy exactOptionalPropertyTypes
    const updateData: Partial<PropertyType> = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    ) as Partial<PropertyType>;

    // Update listing in Notion
    const property = await updateListing(id, updateData);

    res.status(200).json(property);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    console.error('Error updating property:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update property listing',
    });
  }
};

// Health check endpoint
export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      status: 'OK',
      message: 'Arambo Property API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Health check failed',
    });
  }
};

// Get property statistics (bonus feature)
export const getPropertyStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // This is a simple implementation - in a real app you'd want more sophisticated aggregation
    const allProperties = await queryListings({});

    const stats = {
      total: allProperties.total,
      byCategory: {},
      byPropertyType: {},
      avgSize: 0,
      avgBedrooms: 0,
    };

    // Calculate basic statistics
    if (allProperties.properties.length > 0) {
      const properties = allProperties.properties;
      
      // Group by category
      const categoryCounts: Record<string, number> = {};
      const typeCounts: Record<string, number> = {};
      let totalSize = 0;
      let totalBedrooms = 0;

      properties.forEach(property => {
        categoryCounts[property.category] = (categoryCounts[property.category] || 0) + 1;
        typeCounts[property.propertyType] = (typeCounts[property.propertyType] || 0) + 1;
        totalSize += property.size;
        totalBedrooms += property.bedrooms;
      });

      stats.byCategory = categoryCounts;
      stats.byPropertyType = typeCounts;
      stats.avgSize = Math.round(totalSize / properties.length);
      stats.avgBedrooms = Math.round((totalBedrooms / properties.length) * 10) / 10;
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching property stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch property statistics',
    });
  }
};