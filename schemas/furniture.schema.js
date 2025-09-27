/**
 * Furniture MongoDB Schema Definition
 * Schema for the Furniture collection with validation and indexes
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Furniture Schema Definition
const FurnitureSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  furnitureType: {
    type: String,
    required: [true, 'Furniture type is required'],
    enum: {
      values: ['Commercial Furniture', 'Residential Furniture'],
      message: 'Furniture type must be either Commercial Furniture or Residential Furniture'
    },
    index: true
  },
  paymentType: {
    type: String,
    enum: {
      values: ['EMI Plan', 'Lease', 'Instant Pay'],
      message: 'Payment type must be EMI Plan, Lease, or Instant Pay'
    },
    index: true
  },
  furnitureCondition: {
    type: String,
    enum: {
      values: ['New Furniture', 'Used Furniture'],
      message: 'Furniture condition must be New Furniture or Used Furniture'
    },
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
FurnitureSchema.index({ furnitureType: 1 }); // Already indexed in schema definition
FurnitureSchema.index({ paymentType: 1 }); // Already indexed in schema definition
FurnitureSchema.index({ furnitureCondition: 1 }); // Already indexed in schema definition
FurnitureSchema.index({ createdAt: -1 }); // For sorting by creation date
FurnitureSchema.index({ email: 1 }); // For finding requests by email
FurnitureSchema.index({ name: 1 }); // For finding requests by name

// Composite indexes
FurnitureSchema.index({ furnitureType: 1, paymentType: 1 }); // For filtering by type and payment
FurnitureSchema.index({ furnitureType: 1, furnitureCondition: 1 }); // For filtering by type and condition

// VIRTUAL FIELDS
FurnitureSchema.virtual('contactInfo').get(function() {
  return {
    name: this.name,
    email: this.email,
    phone: this.phone
  };
});

// Virtual for request summary
FurnitureSchema.virtual('requestSummary').get(function() {
  return `${this.furnitureCondition} ${this.furnitureType} - ${this.paymentType}`;
});

// INSTANCE METHODS
FurnitureSchema.methods.isCommercial = function() {
  return this.furnitureType === 'Commercial Furniture';
};

FurnitureSchema.methods.isResidential = function() {
  return this.furnitureType === 'Residential Furniture';
};

FurnitureSchema.methods.isNewFurniture = function() {
  return this.furnitureCondition === 'New Furniture';
};

FurnitureSchema.methods.isUsedFurniture = function() {
  return this.furnitureCondition === 'Used Furniture';
};

FurnitureSchema.methods.hasPaymentPlan = function() {
  return this.paymentType === 'EMI Plan' || this.paymentType === 'Lease';
};

// STATIC METHODS
FurnitureSchema.statics.findByType = function(furnitureType) {
  return this.find({ furnitureType });
};

FurnitureSchema.statics.findByPaymentType = function(paymentType) {
  return this.find({ paymentType });
};

FurnitureSchema.statics.findByCondition = function(condition) {
  return this.find({ furnitureCondition: condition });
};

FurnitureSchema.statics.findCommercial = function() {
  return this.find({ furnitureType: 'Commercial Furniture' });
};

FurnitureSchema.statics.findResidential = function() {
  return this.find({ furnitureType: 'Residential Furniture' });
};

FurnitureSchema.statics.findNewFurniture = function() {
  return this.find({ furnitureCondition: 'New Furniture' });
};

FurnitureSchema.statics.findUsedFurniture = function() {
  return this.find({ furnitureCondition: 'Used Furniture' });
};

FurnitureSchema.statics.findByContactEmail = function(email) {
  return this.find({ email: email.toLowerCase() });
};

FurnitureSchema.statics.findByContactName = function(namePattern) {
  return this.find({ 
    name: { $regex: namePattern, $options: 'i' } 
  });
};

FurnitureSchema.statics.findRecentRequests = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    createdAt: { $gte: cutoffDate }
  }).sort({ createdAt: -1 });
};

// PRE-SAVE MIDDLEWARE
FurnitureSchema.pre('save', function(next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Ensure phone number doesn't have spaces
  if (this.phone) {
    this.phone = this.phone.replace(/\s+/g, '');
  }
  
  // Capitalize name properly
  if (this.name) {
    this.name = this.name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  next();
});

// PRE-UPDATE MIDDLEWARE
FurnitureSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate();
  
  if (update.email) {
    update.email = update.email.toLowerCase();
  }
  
  if (update.phone) {
    update.phone = update.phone.replace(/\s+/g, '');
  }
  
  if (update.name) {
    update.name = update.name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  next();
});

// POST-SAVE MIDDLEWARE (for logging or notifications)
FurnitureSchema.post('save', function(doc) {
  console.log(`Furniture request created/updated: ${doc.name} - ${doc.furnitureType}`);
});

module.exports = FurnitureSchema;