import mongoose, { Document, Schema } from 'mongoose';

export interface ITruck extends Document {
  modelNumber: string;
  height: number;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TruckSchema = new Schema<ITruck>({
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

TruckSchema.index({ modelNumber: 1 });
TruckSchema.index({ isOpen: 1 });
TruckSchema.index({ height: 1 });

export const Truck = mongoose.model<ITruck>('Truck', TruckSchema);