/**
 * Trip MongoDB Schema Definition
 * Schema for the Trip collection with validation, indexes, and truck relationship
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Trip Schema Definition
const TripSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name must be less than 100 characters'],
    minlength: [1, 'Name cannot be empty'],
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
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    trim: true,
    enum: {
      values: ['Perishable Goods', 'Non-Perishable Goods', 'Fragile', 'Other'],
      message: 'Product type must be one of: Perishable Goods, Non-Perishable Goods, Fragile, or Other'
    },
    index: true
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true,
    maxlength: [300, 'Pickup location must be less than 300 characters'],
    index: true
  },
  dropOffLocation: {
    type: String,
    required: [true, 'Drop-off location is required'],
    trim: true,
    maxlength: [300, 'Drop-off location must be less than 300 characters'],
    index: true
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required'],
    index: true
  },
  preferredTimeSlot: {
    type: String,
    required: [true, 'Preferred time slot is required'],
    enum: {
      values: ['Morning (8AM - 12PM)', 'Afternoon (12PM - 4PM)', 'Evening (4PM - 8PM)'],
      message: 'Invalid time slot. Must be: Morning (8AM - 12PM), Afternoon (12PM - 4PM), or Evening (4PM - 8PM)'
    },
    index: true
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Additional notes must be less than 500 characters'],
    default: ''
  },
  truckId: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: [true, 'Truck ID is required'],
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
// Composite indexes
TripSchema.index({ name: 1, email: 1 }); // For finding trips by contact
TripSchema.index({ preferredDate: 1, preferredTimeSlot: 1 }); // For scheduling queries
TripSchema.index({ truckId: 1, preferredDate: 1 }); // For truck availability
TripSchema.index({ productType: 1, preferredDate: 1 }); // For product-based filtering
TripSchema.index({ createdAt: -1 }); // For sorting by creation date

// Location-based indexes
TripSchema.index({ pickupLocation: 1 });
TripSchema.index({ dropOffLocation: 1 });

// VIRTUAL FIELDS
// Virtual to populate truck details
TripSchema.virtual('truck', {
  ref: 'Truck',
  localField: 'truckId',
  foreignField: '_id',
  justOne: true
});

// Virtual for trip duration (if needed in future)
TripSchema.virtual('timeSlotHours').get(function() {
  const timeSlots = {
    'Morning (8AM - 12PM)': { start: 8, end: 12 },
    'Afternoon (12PM - 4PM)': { start: 12, end: 16 },
    'Evening (4PM - 8PM)': { start: 16, end: 20 }
  };
  return timeSlots[this.preferredTimeSlot] || null;
});

// INSTANCE METHODS
TripSchema.methods.isUpcoming = function() {
  return this.preferredDate > new Date();
};

TripSchema.methods.isPast = function() {
  return this.preferredDate < new Date();
};

TripSchema.methods.isToday = function() {
  const today = new Date();
  const tripDate = this.preferredDate;
  return tripDate.toDateString() === today.toDateString();
};

TripSchema.methods.getContactInfo = function() {
  return {
    name: this.name,
    email: this.email,
    phone: this.phone
  };
};

// STATIC METHODS
TripSchema.statics.findByTruck = function(truckId) {
  return this.find({ truckId });
};

TripSchema.statics.findByDate = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    preferredDate: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
};

TripSchema.statics.findByTimeSlot = function(timeSlot) {
  return this.find({ preferredTimeSlot: timeSlot });
};

TripSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    preferredDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  });
};

TripSchema.statics.findUpcoming = function() {
  return this.find({
    preferredDate: { $gte: new Date() }
  }).sort({ preferredDate: 1 });
};

TripSchema.statics.findByProductType = function(productType) {
  return this.find({ productType });
};

TripSchema.statics.findByLocationPattern = function(locationPattern) {
  return this.find({
    $or: [
      { pickupLocation: { $regex: locationPattern, $options: 'i' } },
      { dropOffLocation: { $regex: locationPattern, $options: 'i' } }
    ]
  });
};

// PRE-SAVE MIDDLEWARE
TripSchema.pre('save', function(next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Ensure phone number doesn't have spaces
  if (this.phone) {
    this.phone = this.phone.replace(/\s+/g, '');
  }
  
  // Validate that preferred date is not in the past (only for new documents)
  if (this.isNew && this.preferredDate < new Date()) {
    const error = new Error('Preferred date cannot be in the past');
    return next(error);
  }
  
  next();
});

// PRE-UPDATE MIDDLEWARE
TripSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate();
  
  if (update.email) {
    update.email = update.email.toLowerCase();
  }
  
  if (update.phone) {
    update.phone = update.phone.replace(/\s+/g, '');
  }
  
  next();
});

// POST-SAVE MIDDLEWARE (for logging or notifications)
TripSchema.post('save', function(doc) {
  console.log(`Trip created/updated: ${doc.name} - ${doc.preferredDate}`);
});

module.exports = TripSchema;