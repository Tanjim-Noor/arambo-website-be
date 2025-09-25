import mongoose, { Document, Schema } from 'mongoose';
import { FurnitureType, PaymentType, FurnitureCondition } from '../../validators/furniture.validator';

// Interface for the Furniture document
export interface IFurniture extends Document {
  name: string;
  email: string;
  phone: string;
  furnitureType: FurnitureType;
  paymentType?: PaymentType;
  furnitureCondition?: FurnitureCondition;
  createdAt: Date;
  updatedAt: Date;
}

// Furniture Schema
const furnitureSchema = new Schema<IFurniture>({
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
    }
  },
  paymentType: {
    type: String,
    enum: {
      values: ['EMI Plan', 'Lease', 'Instant Pay'],
      message: 'Payment type must be EMI Plan, Lease, or Instant Pay'
    }
  },
  furnitureCondition: {
    type: String,
    enum: {
      values: ['New Furniture', 'Used Furniture'],
      message: 'Furniture condition must be New Furniture or Used Furniture'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
furnitureSchema.index({ furnitureType: 1 });
furnitureSchema.index({ paymentType: 1 });
furnitureSchema.index({ furnitureCondition: 1 });
furnitureSchema.index({ createdAt: -1 });

// Create and export the model
export const Furniture = mongoose.model<IFurniture>('Furniture', furnitureSchema);