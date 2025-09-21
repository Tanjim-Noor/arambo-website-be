import { Property, IProperty } from '../database/models/property.model';
import { Property as PropertyType, PropertyFilters, PropertyResponse } from '../validators/property.validator';
import { FilterQuery, SortOrder } from 'mongoose';

/**
 * Property Service
 * Handles all database operations for properties using MongoDB/Mongoose
 */
export class PropertyService {
  
  /**
   * Create a new property listing
   */
  static async createListing(data: PropertyType): Promise<PropertyResponse> {
    try {
      const property = new Property(data);
      const savedProperty = await property.save();
      
      return this.convertToResponse(savedProperty);
    } catch (error) {
      console.error('Error creating property listing:', error);
      
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new Error(`Validation failed: ${error.message}`);
      }
      
      throw new Error('Failed to create property listing');
    }
  }

  /**
   * Query property listings with filters and pagination
   */
  static async queryListings(filters: PropertyFilters): Promise<{
    properties: PropertyResponse[];
    total: number;
  }> {
    try {
      // Build MongoDB filter query
      const query: FilterQuery<IProperty> = {};

      // Category filter
      if (filters.category) {
        query.category = filters.category;
      }

      // Property type filter
      if (filters.propertyType) {
        query.propertyType = filters.propertyType;
      }

      // Bedrooms filter
      if (filters.bedrooms !== undefined) {
        query.bedrooms = filters.bedrooms;
      }

      // Size range filters
      if (filters.minSize !== undefined || filters.maxSize !== undefined) {
        query.size = {};
        if (filters.minSize !== undefined) {
          query.size.$gte = filters.minSize;
        }
        if (filters.maxSize !== undefined) {
          query.size.$lte = filters.maxSize;
        }
      }

      // Location filter (case-insensitive partial match)
      if (filters.location) {
        query.location = { 
          $regex: filters.location, 
          $options: 'i' 
        };
      }

      // First owner filter
      if (filters.firstOwner !== undefined) {
        query.firstOwner = filters.firstOwner;
      }

      // On loan filter
      if (filters.onLoan !== undefined) {
        query.onLoan = filters.onLoan;
      }

      console.log('MongoDB query filters:', JSON.stringify(query, null, 2));

      // Execute query with sorting
      const properties = await Property.find(query)
        .sort({ createdAt: -1 as SortOrder })
        .limit(100) // Limit results to prevent overwhelming responses
        .lean()
        .exec();

      // Convert to response format
      const responseProperties = properties.map(property => this.convertToResponse(property));

      return {
        properties: responseProperties,
        total: responseProperties.length,
      };
    } catch (error) {
      console.error('Error querying property listings:', error);
      throw new Error('Failed to fetch property listings');
    }
  }

  /**
   * Get a single property by ID
   */
  static async getListingById(id: string): Promise<PropertyResponse | null> {
    try {
      const property = await Property.findById(id).lean().exec();
      
      if (!property) {
        return null;
      }

      return this.convertToResponse(property);
    } catch (error) {
      console.error('Error fetching property by ID:', error);
      return null;
    }
  }

  /**
   * Update a property listing
   */
  static async updateListing(id: string, data: Partial<PropertyType>): Promise<PropertyResponse> {
    try {
      const updatedProperty = await Property.findByIdAndUpdate(
        id,
        { 
          ...data,
          updatedAt: new Date()
        },
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators
        }
      ).exec();

      if (!updatedProperty) {
        throw new Error('Property not found');
      }

      return this.convertToResponse(updatedProperty);
    } catch (error) {
      console.error('Error updating property listing:', error);
      
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new Error(`Validation failed: ${error.message}`);
      }
      
      if (error instanceof Error && error.message === 'Property not found') {
        throw error;
      }
      
      throw new Error('Failed to update property listing');
    }
  }

  /**
   * Delete a property listing
   */
  static async deleteListing(id: string): Promise<boolean> {
    try {
      const deletedProperty = await Property.findByIdAndDelete(id).exec();
      return deletedProperty !== null;
    } catch (error) {
      console.error('Error deleting property listing:', error);
      throw new Error('Failed to delete property listing');
    }
  }

  /**
   * Search properties using text search
   */
  static async searchProperties(searchTerm: string): Promise<PropertyResponse[]> {
    try {
      const properties = await Property.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(50)
      .lean()
      .exec();

      return properties.map(property => this.convertToResponse(property));
    } catch (error) {
      console.error('Error searching properties:', error);
      throw new Error('Failed to search properties');
    }
  }

  /**
   * Get properties by category
   */
  static async getPropertiesByCategory(category: string): Promise<PropertyResponse[]> {
    try {
      const properties = await Property.find({ category })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      return properties.map((property: any) => this.convertToResponse(property));
    } catch (error) {
      console.error('Error fetching properties by category:', error);
      throw new Error('Failed to fetch properties by category');
    }
  }

  /**
   * Get available properties (not on loan)
   */
  static async getAvailableProperties(): Promise<PropertyResponse[]> {
    try {
      const properties = await Property.find({ onLoan: false })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      return properties.map((property: any) => this.convertToResponse(property));
    } catch (error) {
      console.error('Error fetching available properties:', error);
      throw new Error('Failed to fetch available properties');
    }
  }

  /**
   * Get property statistics
   */
  static async getPropertyStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byPropertyType: Record<string, number>;
    available: number;
    onLoan: number;
  }> {
    try {
      const [
        total,
        categoryCounts,
        typeCounts,
        availableCount,
        onLoanCount
      ] = await Promise.all([
        Property.countDocuments(),
        Property.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]),
        Property.aggregate([
          { $group: { _id: '$propertyType', count: { $sum: 1 } } }
        ]),
        Property.countDocuments({ onLoan: false }),
        Property.countDocuments({ onLoan: true })
      ]);

      const byCategory: Record<string, number> = {};
      categoryCounts.forEach((item: any) => {
        byCategory[item._id] = item.count;
      });

      const byPropertyType: Record<string, number> = {};
      typeCounts.forEach((item: any) => {
        byPropertyType[item._id] = item.count;
      });

      return {
        total,
        byCategory,
        byPropertyType,
        available: availableCount,
        onLoan: onLoanCount
      };
    } catch (error) {
      console.error('Error fetching property statistics:', error);
      throw new Error('Failed to fetch property statistics');
    }
  }

  /**
   * Convert MongoDB document to API response format
   */
  private static convertToResponse(property: any): PropertyResponse {
    return {
      id: property._id?.toString() || property.id?.toString(),
      name: property.name,
      email: property.email,
      phone: property.phone,
      propertyName: property.propertyName,
      propertyType: property.propertyType,
      size: property.size,
      location: property.location,
      bedrooms: property.bedrooms,
      bathroom: property.bathroom,
      baranda: property.baranda,
      category: property.category,
      notes: property.notes || '',
      firstOwner: property.firstOwner,
      lift: property.lift,
      paperworkUpdated: property.paperworkUpdated,
      onLoan: property.onLoan,
      createdAt: property.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: property.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}

// Export legacy function names for backward compatibility
export const createListing = PropertyService.createListing.bind(PropertyService);
export const queryListings = PropertyService.queryListings.bind(PropertyService);
export const getListingById = PropertyService.getListingById.bind(PropertyService);
export const updateListing = PropertyService.updateListing.bind(PropertyService);
export const deleteListing = PropertyService.deleteListing.bind(PropertyService);
export const searchProperties = PropertyService.searchProperties.bind(PropertyService);