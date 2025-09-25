import { Furniture, IFurniture } from '../database/models/furniture.model';
import { Furniture as FurnitureType, FurnitureFilters, FurnitureResponse, PaginationMeta } from '../validators/furniture.validator';
import { PAGINATION } from '../config/constant';
import { FilterQuery, SortOrder } from 'mongoose';

/**
 * Furniture Service
 * Handles all database operations for furniture using MongoDB/Mongoose
 */
export class FurnitureService {
  
  /**
   * Create a new furniture item
   */
  static async createFurniture(data: FurnitureType): Promise<FurnitureResponse> {
    try {
      const furniture = new Furniture(data);
      const savedFurniture = await furniture.save();
      
      return this.convertToResponse(savedFurniture);
    } catch (error) {
      console.error('Error creating furniture item:', error);
      
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new Error(`Validation failed: ${error.message}`);
      }
      
      throw new Error('Failed to create furniture item');
    }
  }

  /**
   * Get furniture with filtering, pagination, and sorting
   */
  static async queryFurniture(filters: FurnitureFilters): Promise<{
    data: FurnitureResponse[];
    meta: PaginationMeta;
  }> {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder
      } = filters;

      // Build filter query (no filters, just get all)
      const query: FilterQuery<IFurniture> = {};



      // Build sort options
      const sortOptions: Record<string, SortOrder> = {};
      sortOptions[sortBy] = sortOrder as SortOrder;

      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Execute queries
      const [furniture, totalCount] = await Promise.all([
        Furniture.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        Furniture.countDocuments(query)
      ]);

      // Convert to response format
      const data = furniture.map(item => this.convertToResponse(item));

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const meta: PaginationMeta = {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
      };

      return { data, meta };
    } catch (error) {
      console.error('Error querying furniture:', error);
      throw new Error('Failed to fetch furniture items');
    }
  }

  /**
   * Get furniture item by ID
   */
  static async getFurnitureById(id: string): Promise<FurnitureResponse | null> {
    try {
      const furniture = await Furniture.findById(id).lean();
      
      if (!furniture) {
        return null;
      }

      return this.convertToResponse(furniture);
    } catch (error) {
      console.error('Error fetching furniture by ID:', error);
      throw new Error('Failed to fetch furniture item');
    }
  }

  /**
   * Update furniture item by ID
   */
  static async updateFurniture(id: string, data: Record<string, any>): Promise<FurnitureResponse | null> {
    try {
      const updatedFurniture = await Furniture.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedFurniture) {
        return null;
      }

      return this.convertToResponse(updatedFurniture);
    } catch (error) {
      console.error('Error updating furniture:', error);
      
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new Error(`Validation failed: ${error.message}`);
      }
      
      throw new Error('Failed to update furniture item');
    }
  }

  /**
   * Delete furniture item by ID
   */
  static async deleteFurniture(id: string): Promise<boolean> {
    try {
      const result = await Furniture.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting furniture:', error);
      throw new Error('Failed to delete furniture item');
    }
  }

  /**
   * Get furniture statistics
   */
  static async getFurnitureStats(): Promise<{
    total: number;
    commercial: number;
    residential: number;
  }> {
    try {
      const [
        total,
        commercial,
        residential
      ] = await Promise.all([
        Furniture.countDocuments(),
        Furniture.countDocuments({ furnitureType: 'Commercial Furniture' }),
        Furniture.countDocuments({ furnitureType: 'Residential Furniture' })
      ]);

      return {
        total,
        commercial,
        residential,
      };
    } catch (error) {
      console.error('Error getting furniture statistics:', error);
      throw new Error('Failed to fetch furniture statistics');
    }
  }

  /**
   * Convert database document to response format
   */
  private static convertToResponse(furniture: any): FurnitureResponse {
    return {
      _id: furniture._id.toString(),
      name: furniture.name,
      email: furniture.email,
      phone: furniture.phone,
      furnitureType: furniture.furnitureType,
      paymentType: furniture.paymentType,
      furnitureCondition: furniture.furnitureCondition,
      createdAt: furniture.createdAt,
      updatedAt: furniture.updatedAt,
    };
  }
}

// Named exports for backward compatibility
export const createFurniture = FurnitureService.createFurniture.bind(FurnitureService);
export const queryFurniture = FurnitureService.queryFurniture.bind(FurnitureService);
export const getFurnitureById = FurnitureService.getFurnitureById.bind(FurnitureService);
export const updateFurniture = FurnitureService.updateFurniture.bind(FurnitureService);
export const deleteFurniture = FurnitureService.deleteFurniture.bind(FurnitureService);
export const getFurnitureStats = FurnitureService.getFurnitureStats.bind(FurnitureService);