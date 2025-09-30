import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface for the Admin document
export interface IAdmin extends Document {
  username: string;
  password: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastLogin(): Promise<void>;
}

// Admin schema definition
const AdminSchema = new Schema<IAdmin>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username must be less than 50 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete (ret as any).__v;
      delete (ret as any).password; // Never expose password in JSON
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete (ret as any).__v;
      delete (ret as any).password; // Never expose password in object
      return ret;
    }
  }
});

// Pre-save middleware to hash password
AdminSchema.pre<IAdmin>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Instance method to update last login
AdminSchema.methods.updateLastLogin = async function(): Promise<void> {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

// Static methods interface
interface AdminStatics {
  findByUsername(username: string): Promise<IAdmin | null>;
  getActiveAdmins(): Promise<IAdmin[]>;
}

// Static methods
AdminSchema.statics.findByUsername = function(username: string) {
  return this.findOne({ 
    username: username.toLowerCase().trim(),
    isActive: true 
  }).select('+password'); // Include password for authentication
};

AdminSchema.statics.getActiveAdmins = function() {
  return this.find({ isActive: true });
};

// Indexes for performance
AdminSchema.index({ username: 1, isActive: 1 });
AdminSchema.index({ lastLogin: -1 });

export const Admin = mongoose.model<IAdmin, mongoose.Model<IAdmin> & AdminStatics>('Admin', AdminSchema);

// Export type definitions
export type AdminDocument = IAdmin;
export type AdminModel = typeof Admin;