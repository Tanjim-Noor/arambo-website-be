/**
 * Truck MongoDB Schema Definition
 * Schema for the Truck collection with validation and indexes
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Truck Schema Definition
const TruckSchema = new Schema({
  modelNumber: {
    type: String,
    required: [true, 'Model number is required'],
    trim: true,
    maxlength: [100, 'Model number must be less than 100 characters'],
    minlength: [1, 'Model number cannot be empty'],
    index: true
  },
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [1, 'Height must be greater than 0'],
    max: [100, 'Height seems unrealistic'],
    index: true
  },
  isOpen: {
    type: Boolean,
    required: [true, 'Truck open/closed status is required'],
    index: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, 'Description must be less than 500 characters'],
    default: ''
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      // Convert _id to id and remove __v
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// INDEXES FOR BETTER QUERY PERFORMANCE
TruckSchema.index({ modelNumber: 1 }); // Already indexed in schema definition
TruckSchema.index({ height: 1, isOpen: 1 }); // Composite index for filtering by height and status
TruckSchema.index({ createdAt: -1 }); // For sorting by creation date

// INSTANCE METHODS
TruckSchema.methods.isAvailable = function() {
  return this.isOpen;
};

TruckSchema.methods.getStatusText = function() {
  return this.isOpen ? 'Open' : 'Closed';
};

// STATIC METHODS
TruckSchema.statics.findAvailableTrucks = function() {
  return this.find({ isOpen: true });
};

TruckSchema.statics.findByHeightRange = function(minHeight, maxHeight) {
  return this.find({ 
    height: { $gte: minHeight, $lte: maxHeight } 
  });
};

TruckSchema.statics.findByModelPattern = function(modelPattern) {
  return this.find({ 
    modelNumber: { $regex: modelPattern, $options: 'i' } 
  });
};

// PRE-SAVE MIDDLEWARE
TruckSchema.pre('save', function(next) {
  // Ensure model number is trimmed and uppercase
  if (this.modelNumber) {
    this.modelNumber = this.modelNumber.trim().toUpperCase();
  }
  
  next();
});

// PRE-UPDATE MIDDLEWARE
TruckSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate();
  
  if (update.modelNumber) {
    update.modelNumber = update.modelNumber.trim().toUpperCase();
  }
  
  next();
});

module.exports = TruckSchema;