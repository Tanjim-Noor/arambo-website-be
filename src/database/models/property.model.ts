import mongoose, { Document, Schema } from 'mongoose';
import { ListingType, Category, PropertyType, Area } from '../../validators/property.validator';

// Interface for the Property document
export interface IProperty extends Document {
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  listingType: ListingType;
  propertyType?: PropertyType;
  size: number;
  location: string;
  bedrooms: number;
  bathroom: number;
  baranda?: number;
  category: Category;
  notes?: string;
  firstOwner?: boolean;
  paperworkUpdated?: boolean;
  onLoan?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lift?: boolean;
  isConfirmed?: boolean;
  
  // New fields
  houseId?: string;
  streetAddress?: string;
  landmark?: string;
  area?: Area;
  listingId?: string;
  inventoryStatus?: string;
  tenantType?: string;
  propertyCategory?: string;
  furnishingStatus?: string;
  availableFrom?: Date;
  floor?: number;
  totalFloor?: number;
  yearOfConstruction?: number;
  rent?: number;
  serviceCharge?: number;
  advanceMonths?: number;


  coverImage?: string;
  otherImages?: string[];


  // Amenities 
  cleanHygieneScore?: number;
  sunlightScore?: number;
  bathroomConditionsScore?: number;

  // Facility boolean fields
  cctv?: boolean;
  communityHall?: boolean;
  gym?: boolean;
  masjid?: boolean;
  parking?: boolean;
  petsAllowed?: boolean;
  swimmingPool?: boolean;
  trainedGuard?: boolean;
  apartmentType?: string;
  isVerified?: boolean;
}

// Property schema definition
const PropertySchema = new Schema<IProperty>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name must be less than 100 characters'],
    minlength: [1, 'Name cannot be empty']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    minlength: [10, 'Phone number must be at least 10 digits'],
    maxlength: [15, 'Phone number must be less than 15 digits'],
    index: true
  },
  propertyName: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true,
    maxlength: [200, 'Property name must be less than 200 characters'],
    minlength: [1, 'Property name cannot be empty'],
    index: true
  },
  listingType: {
    type: String,
    index: true
  },
  propertyType: {
    type: String,
    enum: {
      values: ['Apartment', 'House', 'Villa'],
      message: 'Invalid property type'
    }
  },
  size: {
    type: Number,
    required: [true, 'Size is required'],
    min: [1, 'Size must be greater than 0'],
    max: [100000, 'Size seems unrealistic'],
    index: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [300, 'Location must be less than 300 characters'],
    minlength: [1, 'Location cannot be empty'],
    index: true
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative'],
    max: [50, 'Too many bedrooms'],
    index: true
  },
  bathroom: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative'],
    max: [50, 'Too many bathrooms']
  },
  baranda: {
    type: Number,
    default: 0,
    min: [0, 'Baranda cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      message: 'Invalid category'
    },
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes must be less than 1000 characters'],
    default: ''
  },
  firstOwner: {
    type: Boolean,
    default: false,
    index: true
  },
  lift: { 
    type: Boolean,
    default: false,  // Set a default value (e.g., false for no lift)
  },
  isConfirmed: {
    type: Boolean,
    default: false,
    index: true
  },
  paperworkUpdated: {
    type: Boolean,
    default: false
  },
  onLoan: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // New fields
  houseId: {
    type: String,
    trim: true,
    maxlength: [50, 'House ID must be less than 50 characters']
  },
  streetAddress: {
    type: String,
    trim: true,
    maxlength: [500, 'Street address must be less than 500 characters']
  },
  landmark: {
    type: String,
    trim: true,
    maxlength: [300, 'Landmark must be less than 300 characters']
  },
  area: {
    type: String,
    trim: true,
    enum: {
      values: [
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
      ],
      message: 'Invalid area'
    },
    index: true
  },
  listingId: {
    type: String,
    trim: true,
    maxlength: [50, 'Listing ID must be less than 50 characters']
  },
  inventoryStatus: {
    type: String,
    trim: true,
    enum: {
      values: ['Looking for Rent', 'Found Tenant', 'Owner Unreachable'],
      message: 'Invalid inventory status'
    }
  },
  tenantType: {
    type: String,
    trim: true,
    enum: {
      values: ['Family', 'Bachelor', 'Women'],
      message: 'Invalid tenant type'
    }
  },
  propertyCategory: {
    type: String,
    trim: true,
    enum: {
      values: ['Residential', "Commercial"],
      message: 'Invalid property category'
    }
  },
  furnishingStatus: {
    type: String,
    trim: true,
    enum: {
      values: ['Unfurnished', 'Semi-Furnished', 'Furnished'],
      message: 'Invalid furnishing status'
    }
  },
  availableFrom: {
    type: Date
  },
  floor: {
    type: Number,
    min: [0, 'Floor cannot be negative'],
    max: [200, 'Floor seems unrealistic']
  },
  totalFloor: {
    type: Number,
    min: [1, 'Total floor must be at least 1'],
    max: [200, 'Total floor seems unrealistic']
  },
  yearOfConstruction: {
    type: Number,
    min: [1800, 'Year of construction seems too old'],
    max: [new Date().getFullYear() + 5, 'Year of construction cannot be too far in future']
  },
  rent: {
    type: Number,
    min: [0, 'Rent cannot be negative'],
    max: [10000000, 'Rent seems unrealistic']
  },
  serviceCharge: {
    type: Number,
    min: [0, 'Service charge cannot be negative'],
    max: [1000000, 'Service charge seems unrealistic']
  },
  advanceMonths: {
    type: Number,
    min: [0, 'Advance months cannot be negative'],
    max: [24, 'Advance months seems too high']
  },
  cleanHygieneScore: {
    type: Number,
    min: [1, 'Clean hygiene score must be between 1-10'],
    max: [10, 'Clean hygiene score must be between 1-10']
  },
  sunlightScore: {
    type: Number,
    min: [1, 'Sunlight score must be between 1-10'],
    max: [10, 'Sunlight score must be between 1-10']
  },
  bathroomConditionsScore: {
    type: Number,
    min: [1, 'Bathroom conditions score must be between 1-10'],
    max: [10, 'Bathroom conditions score must be between 1-10']
  },
  
  // Facility boolean fields
  cctv: {
    type: Boolean,
    default: false
  },
  communityHall: {
    type: Boolean,
    default: false
  },
  gym: {
    type: Boolean,
    default: false
  },
  masjid: {
    type: Boolean,
    default: false
  },
  parking: {
    type: Boolean,
    default: false
  },
  petsAllowed: {
    type: Boolean,
    default: false
  },
  swimmingPool: {
    type: Boolean,
    default: false
  },
  trainedGuard: {
    type: Boolean,
    default: false
  },
  
  coverImage: {
    type: String,
    trim: true,
    maxlength: [500, 'Cover image URL must be less than 500 characters']
  },
  otherImages: {
    type: [String],
    validate: {
      validator: function(images: string[]) {
        return images.length <= 20; // Max 20 images
      },
      message: 'Cannot have more than 20 images'
    }
  },
  apartmentType: {
    type: String,
    trim: true,
    maxlength: [100, 'Apartment type must be less than 100 characters']
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      // Convert _id to id and remove __v
      ret.id = ret._id;
      delete ret._id;
      delete (ret as any).__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indexes for better query performance
PropertySchema.index({ listingType: 1, category: 1 });
PropertySchema.index({ location: 1, listingType: 1 });
PropertySchema.index({ bedrooms: 1, size: 1 });
PropertySchema.index({ firstOwner: 1, onLoan: 1 });
// PropertySchema.index({ isConfirmed: 1 }); // Index for confirmed properties - removed duplicate
PropertySchema.index({ createdAt: -1 }); // For sorting by creation date
PropertySchema.index({ email: 1, phone: 1 }); // Composite index for contact info
PropertySchema.index({ area: 1, propertyCategory: 1 }); // New indexes
PropertySchema.index({ inventoryStatus: 1, tenantType: 1 });
PropertySchema.index({ rent: 1, bedrooms: 1 });
PropertySchema.index({ houseId: 1 });
PropertySchema.index({ listingId: 1 });

// Indexes for facility filters
PropertySchema.index({ cctv: 1 });
PropertySchema.index({ parking: 1 });
PropertySchema.index({ gym: 1 });
PropertySchema.index({ swimmingPool: 1 });
PropertySchema.index({ trainedGuard: 1 });

// Text index for search functionality
PropertySchema.index({
  propertyName: 'text',
  location: 'text',
  notes: 'text',
  streetAddress: 'text',
  landmark: 'text',
  area: 'text'
}, {
  weights: {
    propertyName: 10,
    streetAddress: 8,
    location: 5,
    area: 5,
    landmark: 3,
    notes: 1
  },
  name: 'property_text_index'
});

// Virtual for full contact info
PropertySchema.virtual('contactInfo').get(function() {
  return {
    name: this.name,
    email: this.email,
    phone: this.phone
  };
});

// Instance methods
PropertySchema.methods.isAvailable = function(): boolean {
  return !this.onLoan;
};

PropertySchema.methods.isFirstOwner = function(): boolean {
  return this.firstOwner;
};

// Static methods
PropertySchema.statics.findByCategory = function(category: Category) {
  return this.find({ category });
};

PropertySchema.statics.findByListingType = function(listingType: ListingType) {
  return this.find({ listingType });
};

PropertySchema.statics.findByPropertyType = function(propertyType: 'Apartment' | 'House' | 'Villa') {
  return this.find({ propertyType });
};

PropertySchema.statics.findByLocationPattern = function(locationPattern: string) {
  return this.find({ 
    location: { $regex: locationPattern, $options: 'i' } 
  });
};

PropertySchema.statics.findAvailable = function() {
  return this.find({ onLoan: false });
};

PropertySchema.statics.findInSizeRange = function(minSize: number, maxSize: number) {
  return this.find({ 
    size: { $gte: minSize, $lte: maxSize } 
  });
};

// Pre-save middleware
PropertySchema.pre('save', function(next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Ensure phone number doesn't have spaces
  if (this.phone) {
    this.phone = this.phone.replace(/\s+/g, '');
  }
  
  next();
});

// Pre-update middleware
PropertySchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate() as any;
  
  if (update.email) {
    update.email = update.email.toLowerCase();
  }
  
  if (update.phone) {
    update.phone = update.phone.replace(/\s+/g, '');
  }
  
  next();
});

// Create and export the model
export const Property = mongoose.model<IProperty>('Property', PropertySchema);

// Export the interface for use in other files
// Export helper types
export type PropertyDocument = IProperty;
export type PropertyModel = typeof Property;