import mongoose, { Document, Schema } from 'mongoose';
import { PropertyType, Category } from '../../validators/property.validator';

// Interface for the Property document
export interface IProperty extends Document {
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  propertyType: PropertyType;
  size: number;
  location: string;
  bedrooms: number;
  bathroom: number;
  baranda: boolean;
  category: Category;
  notes?: string;
  firstOwner: boolean;
  paperworkUpdated: boolean;
  onLoan: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: {
      values: ['apartment', 'house', 'villa', 'townhouse', 'studio', 'duplex', 'penthouse', 'commercial', 'land', 'other'],
      message: 'Invalid property type'
    },
    index: true
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
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['sale', 'rent', 'lease', 'buy'],
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
  paperworkUpdated: {
    type: Boolean,
    default: false
  },
  onLoan: {
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
PropertySchema.index({ propertyType: 1, category: 1 });
PropertySchema.index({ location: 1, propertyType: 1 });
PropertySchema.index({ bedrooms: 1, size: 1 });
PropertySchema.index({ firstOwner: 1, onLoan: 1 });
PropertySchema.index({ createdAt: -1 }); // For sorting by creation date
PropertySchema.index({ email: 1, phone: 1 }); // Composite index for contact info

// Text index for search functionality
PropertySchema.index({
  propertyName: 'text',
  location: 'text',
  notes: 'text'
}, {
  weights: {
    propertyName: 10,
    location: 5,
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

PropertySchema.statics.findByPropertyType = function(propertyType: PropertyType) {
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