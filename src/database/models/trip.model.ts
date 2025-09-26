import mongoose, { Document, Schema } from 'mongoose';

export interface ITrip extends Document {
  name: string;
  phone: string;
  email: string;
  productType: 'Perishable Goods' | 'Non-Perishable Goods' | 'Fragile' | 'Other';
  pickupLocation: string;
  dropOffLocation: string;
  preferredDate: Date;
  preferredTimeSlot: 'Morning (8AM - 12PM)' | 'Afternoon (12PM - 4PM)' | 'Evening (4PM - 8PM)';
  additionalNotes?: string;
  truck: string;
  truckId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>({
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
  truck: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  truckId: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: [false, 'Truck ID is required'],
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
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
TripSchema.index({ name: 1, email: 1 });
TripSchema.index({ preferredDate: 1, preferredTimeSlot: 1 });
TripSchema.index({ truckId: 1, preferredDate: 1 });
// TripSchema.index({ dropOffLocation: 1 }); // Removed duplicate index

// Virtual to populate truck details
TripSchema.virtual('truckDetails', {
  ref: 'Truck',
  localField: 'truckId',
  foreignField: '_id',
  justOne: true
});

export const Trip = mongoose.model<ITrip>('Trip', TripSchema);