import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  CreateFurnitureRequestSchema,
  UpdateFurnitureRequestSchema,
  FurnitureFiltersSchema,
  FurnitureResponse,
  FurnitureListResponse,
  ErrorResponse,
  Furniture as FurnitureType,
} from '../validators/furniture.validator';
import {
  createFurniture,
  queryFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
  getFurnitureStats,
} from '../services/furniture.service';

// Create a new furniture item
export const createFurnitureItem = async (
  req: Request,
  res: Response<FurnitureResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = CreateFurnitureRequestSchema.parse(req.body);

    // Create furniture in database
    const furniture = await createFurniture(validatedData);

    res.status(201).json(furniture);
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

    console.error('Error creating furniture:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create furniture item',
    });
  }
};

// Get furniture items with filtering and pagination
export const getFurnitureItems = async (
  req: Request,
  res: Response<FurnitureListResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Parse and validate query parameters
    const queryParams = {
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    };

    const validatedFilters = FurnitureFiltersSchema.parse(queryParams);

    // Query furniture from database
    const result = await queryFurniture(validatedFilters);

    res.status(200).json(result);
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

    console.error('Error fetching furniture:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch furniture items',
    });
  }
};

// Get furniture item by ID
export const getFurnitureItem = async (
  req: Request,
  res: Response<FurnitureResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Furniture ID is required',
      });
      return;
    }

    const furniture = await getFurnitureById(id);

    if (!furniture) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Furniture item not found',
      });
      return;
    }

    res.status(200).json(furniture);
  } catch (error) {
    console.error('Error fetching furniture by ID:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch furniture item',
    });
  }
};

// Update furniture item by ID
export const updateFurnitureItem = async (
  req: Request,
  res: Response<FurnitureResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Furniture ID is required',
      });
      return;
    }

    // Validate request body
    const validatedData = UpdateFurnitureRequestSchema.parse(req.body);

    // Update furniture in database
    const furniture = await updateFurniture(id, validatedData);

    if (!furniture) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Furniture item not found',
      });
      return;
    }

    res.status(200).json(furniture);
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

    console.error('Error updating furniture:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update furniture item',
    });
  }
};

// Delete furniture item by ID
export const deleteFurnitureItem = async (
  req: Request,
  res: Response<{ message: string } | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Furniture ID is required',
      });
      return;
    }

    const deleted = await deleteFurniture(id);

    if (!deleted) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Furniture item not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Furniture item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting furniture:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete furniture item',
    });
  }
};

// Get furniture statistics
export const getFurnitureStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await getFurnitureStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching furniture statistics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch furniture statistics',
    });
  }
};

// Health check endpoint
export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.status(200).json({
    status: 'OK',
    message: 'Furniture API is running',
    timestamp: new Date().toISOString(),
  });
};