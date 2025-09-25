import { Property, IProperty } from '../database/models/property.model';
import { Property as PropertyType, PropertyFilters, PropertyResponse, PaginationMeta } from '../validators/property.validator';
import { PAGINATION } from '../config/constant';
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
    pagination: PaginationMeta;
  }> {
    try {
      // Extract pagination parameters
      const page = filters.page || PAGINATION.DEFAULT_PAGE;
      const limit = filters.limit || PAGINATION.DEFAULT_LIMIT;
      const skip = (page - 1) * limit;

      // Build MongoDB filter query
      const query: FilterQuery<IProperty> = {
        // Default filter: only return confirmed properties unless explicitly overridden
        isConfirmed: filters.isConfirmed !== undefined ? filters.isConfirmed : true
      };

      // Category filter
      if (filters.category) {
        query.category = filters.category;
      }

      // Listing type filter (formerly propertyType)
      if (filters.listingType) {
        query.listingType = filters.listingType;
      }

      // Property type filter
      if (filters.propertyType) {
        query.propertyType = filters.propertyType;
      }

      // Bedrooms filter - supports exact match (3) or minimum (3+)
      if (filters.bedrooms !== undefined) {
        if (typeof filters.bedrooms === 'object' && filters.bedrooms.type === 'min') {
          query.bedrooms = { $gte: filters.bedrooms.value };
        } else if (typeof filters.bedrooms === 'object' && filters.bedrooms.type === 'exact') {
          query.bedrooms = filters.bedrooms.value;
        } else {
          // Fallback for backward compatibility
          query.bedrooms = filters.bedrooms;
        }
      }

      // Bathrooms filter - supports exact match (2) or minimum (2+)
      if (filters.bathroom !== undefined) {
        if (typeof filters.bathroom === 'object' && filters.bathroom.type === 'min') {
          query.bathroom = { $gte: filters.bathroom.value };
        } else if (typeof filters.bathroom === 'object' && filters.bathroom.type === 'exact') {
          query.bathroom = filters.bathroom.value;
        } else {
          // Fallback for backward compatibility
          query.bathroom = filters.bathroom;
        }
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

      // Area filter (case-insensitive partial match)
      if (filters.area) {
        query.area = { 
          $regex: filters.area, 
          $options: 'i' 
        };
      }

      // Inventory status filter
      if (filters.inventoryStatus) {
        query.inventoryStatus = filters.inventoryStatus;
      }

      // Tenant type filter
      if (filters.tenantType) {
        query.tenantType = filters.tenantType;
      }

      // Property category filter
      if (filters.propertyCategory) {
        query.propertyCategory = filters.propertyCategory;
      }

      // Furnishing status filter
      if (filters.furnishingStatus) {
        query.furnishingStatus = filters.furnishingStatus;
      }

      // Rent range filters
      if (filters.minRent !== undefined || filters.maxRent !== undefined) {
        query.rent = {};
        if (filters.minRent !== undefined) {
          query.rent.$gte = filters.minRent;
        }
        if (filters.maxRent !== undefined) {
          query.rent.$lte = filters.maxRent;
        }
      }

      // Floor filter
      if (filters.floor !== undefined) {
        query.floor = filters.floor;
      }

      // House ID filter
      if (filters.houseId) {
        query.houseId = { 
          $regex: filters.houseId, 
          $options: 'i' 
        };
      }

      // Listing ID filter
      if (filters.listingId) {
        query.listingId = { 
          $regex: filters.listingId, 
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

      // Apartment type filter
      if (filters.apartmentType) {
        query.apartmentType = { 
          $regex: filters.apartmentType, 
          $options: 'i' 
        };
      }

      // Verified filter
      if (filters.isVerified !== undefined) {
        query.isVerified = filters.isVerified;
      }

      // Facility filters
      if (filters.cctv !== undefined) {
        query.cctv = filters.cctv;
      }
      if (filters.communityHall !== undefined) {
        query.communityHall = filters.communityHall;
      }
      if (filters.gym !== undefined) {
        query.gym = filters.gym;
      }
      if (filters.masjid !== undefined) {
        query.masjid = filters.masjid;
      }
      if (filters.parking !== undefined) {
        query.parking = filters.parking;
      }
      if (filters.petsAllowed !== undefined) {
        query.petsAllowed = filters.petsAllowed;
      }
      if (filters.swimmingPool !== undefined) {
        query.swimmingPool = filters.swimmingPool;
      }
      if (filters.trainedGuard !== undefined) {
        query.trainedGuard = filters.trainedGuard;
      }

      console.log('MongoDB query filters:', JSON.stringify(query, null, 2));
      console.log('Pagination:', { page, limit, skip });

      // Get total count for pagination
      const totalItems = await Property.countDocuments(query);
      console.log('Query:', query);
      // Execute paginated query with sorting
      const properties = await Property.find(query)
        .sort({ createdAt: -1 as SortOrder })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalItems / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      const pagination: PaginationMeta = {
        currentPage: page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : undefined,
        prevPage: hasPrevPage ? page - 1 : undefined,
      };

      // Convert to response format
      const responseProperties = properties.map(property => this.convertToResponse(property));

      return {
        properties: responseProperties,
        total: totalItems, // For backward compatibility
        pagination,
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
      const query: FilterQuery<IProperty> = { _id: id };
      
      // Only show confirmed properties by default
      // if (!includeUnconfirmed) {
      //   query.isConfirmed = true;
      // }
      
      const property = await Property.findOne(query).lean().exec();
      
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
      const properties = await Property.find({ category, isConfirmed: true })
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
      const properties = await Property.find({ onLoan: false, isConfirmed: true })
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
        Property.countDocuments({ isConfirmed: true }),
        Property.aggregate([
          { $match: { isConfirmed: true } },
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]),
        Property.aggregate([
          { $match: { isConfirmed: true } },
          { $group: { _id: '$propertyType', count: { $sum: 1 } } }
        ]),
        Property.countDocuments({ onLoan: false, isConfirmed: true }),
        Property.countDocuments({ onLoan: true, isConfirmed: true })
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
      listingType: property.listingType,
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
      isConfirmed: property.isConfirmed,
      paperworkUpdated: property.paperworkUpdated,
      onLoan: property.onLoan,
      
      // New optional fields
      houseId: property.houseId,
      streetAddress: property.streetAddress,
      landmark: property.landmark,
      area: property.area,
      listingId: property.listingId,
      inventoryStatus: property.inventoryStatus,
      tenantType: property.tenantType,
      propertyCategory: property.propertyCategory,
      furnishingStatus: property.furnishingStatus,
      availableFrom: property.availableFrom?.toISOString(),
      floor: property.floor,
      totalFloor: property.totalFloor,
      yearOfConstruction: property.yearOfConstruction,
      rent: property.rent,
      serviceCharge: property.serviceCharge,
      advanceMonths: property.advanceMonths,
      
      
      cleanHygieneScore: property.cleanHygieneScore,
      sunlightScore: property.sunlightScore,
      bathroomConditionsScore: property.bathroomConditionsScore,
      
      // Facility boolean fields
      cctv: property.cctv,
      communityHall: property.communityHall,
      gym: property.gym,
      masjid: property.masjid,
      parking: property.parking,
      petsAllowed: property.petsAllowed,
      swimmingPool: property.swimmingPool,
      trainedGuard: property.trainedGuard,
      
      coverImage: property.coverImage,
      otherImages: property.otherImages,
      apartmentType: property.apartmentType,
      isVerified: property.isVerified,
      
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