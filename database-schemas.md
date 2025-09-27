# Database Schemas Documentation

This document contains the complete MongoDB schema definitions for all collections in the Arambo Property API.

---

## Table of Contents

1. [Property Schema](#property-schema)
2. [Truck Schema](#truck-schema)
3. [Trip Schema](#trip-schema)
4. [Furniture Schema](#furniture-schema)
5. [Schema Relationships](#schema-relationships)
6. [Implementation Notes](#implementation-notes)

---

## Property Schema

The Property schema is the most complex, containing 50+ fields for comprehensive property management.

### Required Fields

```javascript
{
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
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Furnished', 'Semi-Furnished', 'Non-Furnished'],
      message: 'Invalid category'
    },
    index: true
  }
}
```

### Property Details (Optional)

```javascript
{
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
  baranda: {
    type: Number,
    default: 0,
    min: [0, 'Baranda cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes must be less than 1000 characters'],
    default: ''
  }
}
```

### Status Fields

```javascript
{
  firstOwner: {
    type: Boolean,
    default: false,
    index: true
  },
  lift: { 
    type: Boolean,
    default: false
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
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  }
}
```

### Location Details

```javascript
{
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
        'Aftabnagar', 'Banani', 'Banani DOHs', 'Banashree', 'Banasree',
        'Baridhara DOHs', 'Baridhara J Block', 'Bashundhara Residential',
        'Dhanmondi', 'DIT & Merul Badda', 'Greenroad', 'Gudaraghat',
        'Gulshan 1', 'Gulshan 2', 'Lalmatia', 'Middle Badda', 'Mirpur DOHs',
        'Mohakhali Amtoli', 'Mohakhali DOHs', 'Mohakhali TB Gate',
        'Mohakhali Wireless', 'Mohanagar Project', 'Niketan', 'Nikunja 1',
        'Nikunja 2', 'North Badda', 'Notun Bazar',
        'Shahjadpur Beside & near Suvastu', 'Shahjadpur Lakeside',
        'Shanti Niketan', 'South Badda', 'South Banasree',
        'Uttara Sector 1', 'Uttara Sector 2', 'Uttara Sector 3',
        'Uttara Sector 4', 'Uttara Sector 5', 'Uttara Sector 6',
        'Uttara Sector 7', 'Uttara Sector 8', 'Uttara Sector 9',
        'Uttara Sector 10', 'Uttara Sector 11', 'Uttara Sector 12',
        'Uttara Sector 13', 'Uttara Sector 14', 'Uttara Sector 15',
        'Uttara Sector 16', 'Uttara Sector 17', 'Uttara Sector 18'
      ],
      message: 'Invalid area'
    },
    index: true
  }
}
```

### Business Fields

```javascript
{
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
      values: ['Residential', 'Commercial'],
      message: 'Invalid property category'
    }
  },
  furnishingStatus: {
    type: String,
    trim: true,
    enum: {
      values: ['Non-Furnished', 'Semi-Furnished', 'Furnished'],
      message: 'Invalid furnishing status'
    }
  }
}
```

### Property Specifications

```javascript
{
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
  }
}
```

### Financial Information

```javascript
{
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
  }
}
```

### Quality Scores (1-10 Scale)

```javascript
{
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
  }
}
```

### Facility Boolean Fields

```javascript
{
  // All default to false
  cctv: { type: Boolean, default: false },
  communityHall: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },
  masjid: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },
  swimmingPool: { type: Boolean, default: false },
  trainedGuard: { type: Boolean, default: false }
}
```

### Media Fields

```javascript
{
  coverImage: {
    type: String,
    trim: true,
    maxlength: [500, 'Cover image URL must be less than 500 characters']
  },
  otherImages: {
    type: [String],
    validate: {
      validator: function(images) {
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
  propertyValueHistory: {
    type: [{
      year: {
        type: Number,
        required: true,
        min: [1900, 'Year must be valid'],
        max: [new Date().getFullYear() + 20, 'Year cannot be too far in future']
      },
      value: {
        type: Number,
        required: true,
        min: [0, 'Property value cannot be negative']
      }
    }],
    default: [],
    validate: {
      validator: function(history) {
        // Ensure years are unique
        const years = history.map(h => h.year);
        return years.length === new Set(years).size;
      },
      message: 'Property value history cannot have duplicate years'
    }
  }
}
```

### Property Schema Indexes

```javascript
// Composite indexes for better query performance
PropertySchema.index({ listingType: 1, category: 1 });
PropertySchema.index({ location: 1, listingType: 1 });
PropertySchema.index({ bedrooms: 1, size: 1 });
PropertySchema.index({ firstOwner: 1, onLoan: 1 });
PropertySchema.index({ createdAt: -1 }); // For sorting by creation date
PropertySchema.index({ email: 1, phone: 1 }); // Composite index for contact info
PropertySchema.index({ area: 1, propertyCategory: 1 });
PropertySchema.index({ inventoryStatus: 1, tenantType: 1 });
PropertySchema.index({ rent: 1, bedrooms: 1 });
PropertySchema.index({ houseId: 1 });
PropertySchema.index({ listingId: 1 });

// Facility filter indexes
PropertySchema.index({ cctv: 1 });
PropertySchema.index({ parking: 1 });
PropertySchema.index({ gym: 1 });
PropertySchema.index({ swimmingPool: 1 });
PropertySchema.index({ trainedGuard: 1 });

// Full-text search index
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
```

### Property Virtual Fields & Methods

```javascript
// Virtual for full contact info
PropertySchema.virtual('contactInfo').get(function() {
  return {
    name: this.name,
    email: this.email,
    phone: this.phone
  };
});

// Instance methods
PropertySchema.methods.isAvailable = function() {
  return !this.onLoan;
};

PropertySchema.methods.isFirstOwner = function() {
  return this.firstOwner;
};

// Static methods
PropertySchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

PropertySchema.statics.findAvailable = function() {
  return this.find({ onLoan: false });
};

PropertySchema.statics.findInSizeRange = function(minSize, maxSize) {
  return this.find({ 
    size: { $gte: minSize, $lte: maxSize } 
  });
};
```

### Property Middleware

```javascript
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
  const update = this.getUpdate();
  
  if (update.email) {
    update.email = update.email.toLowerCase();
  }
  
  if (update.phone) {
    update.phone = update.phone.replace(/\s+/g, '');
  }
  
  next();
});
```

---

## Truck Schema

Simple schema for managing delivery trucks.

### Complete Schema

```javascript
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
  timestamps: true
});
```

### Truck Indexes

```javascript
TruckSchema.index({ height: 1, isOpen: 1 }); // Composite index for filtering
TruckSchema.index({ createdAt: -1 }); // For sorting by creation date
```

### Truck Methods

```javascript
// Instance methods
TruckSchema.methods.isAvailable = function() {
  return this.isOpen;
};

// Static methods
TruckSchema.statics.findAvailableTrucks = function() {
  return this.find({ isOpen: true });
};

TruckSchema.statics.findByHeightRange = function(minHeight, maxHeight) {
  return this.find({ 
    height: { $gte: minHeight, $lte: maxHeight } 
  });
};
```

---

## Trip Schema

Schema for managing delivery trips with truck relationships.

### Complete Schema

```javascript
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
  timestamps: true
});
```

### Trip Indexes

```javascript
// Composite indexes for better query performance
TripSchema.index({ name: 1, email: 1 });
TripSchema.index({ preferredDate: 1, preferredTimeSlot: 1 });
TripSchema.index({ truckId: 1, preferredDate: 1 });
TripSchema.index({ productType: 1, preferredDate: 1 });
TripSchema.index({ createdAt: -1 });
```

### Trip Virtual Population

```javascript
// Virtual to populate truck details
TripSchema.virtual('truck', {
  ref: 'Truck',
  localField: 'truckId',
  foreignField: '_id',
  justOne: true
});
```

### Trip Methods

```javascript
// Instance methods
TripSchema.methods.isUpcoming = function() {
  return this.preferredDate > new Date();
};

TripSchema.methods.isToday = function() {
  const today = new Date();
  const tripDate = this.preferredDate;
  return tripDate.toDateString() === today.toDateString();
};

// Static methods
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

TripSchema.statics.findUpcoming = function() {
  return this.find({
    preferredDate: { $gte: new Date() }
  }).sort({ preferredDate: 1 });
};
```

---

## Furniture Schema

Schema for managing furniture requests.

### Complete Schema

```javascript
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
  timestamps: true
});
```

### Furniture Indexes

```javascript
// Individual indexes
FurnitureSchema.index({ furnitureType: 1 });
FurnitureSchema.index({ paymentType: 1 });
FurnitureSchema.index({ furnitureCondition: 1 });
FurnitureSchema.index({ createdAt: -1 });

// Composite indexes
FurnitureSchema.index({ furnitureType: 1, paymentType: 1 });
FurnitureSchema.index({ furnitureType: 1, furnitureCondition: 1 });
```

### Furniture Methods

```javascript
// Instance methods
FurnitureSchema.methods.isCommercial = function() {
  return this.furnitureType === 'Commercial Furniture';
};

FurnitureSchema.methods.isNewFurniture = function() {
  return this.furnitureCondition === 'New Furniture';
};

// Static methods
FurnitureSchema.statics.findByType = function(furnitureType) {
  return this.find({ furnitureType });
};

FurnitureSchema.statics.findCommercial = function() {
  return this.find({ furnitureType: 'Commercial Furniture' });
};

FurnitureSchema.statics.findRecentRequests = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    createdAt: { $gte: cutoffDate }
  }).sort({ createdAt: -1 });
};
```

---

## Schema Relationships

```
Property (standalone)
    ├── No direct relationships
    └── Self-contained property information

Truck (standalone) ←→ Trip (references Truck via truckId)
    ├── One-to-many relationship
    └── Trip.truckId → Truck._id

Furniture (standalone)
    ├── No direct relationships
    └── Self-contained furniture request information
```

### Relationship Details

1. **Trip → Truck**: Each trip references a truck via `truckId` field
   - Type: `Schema.Types.ObjectId`
   - Reference: `'Truck'`
   - Required: `true`
   - Indexed: `true`

2. **Virtual Population**: Trips can populate truck details using virtual field
   ```javascript
   TripSchema.virtual('truck', {
     ref: 'Truck',
     localField: 'truckId',
     foreignField: '_id',
     justOne: true
   });
   ```

---

## Implementation Notes

### Schema Options

All schemas include these common options:
```javascript
{
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
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
}
```

### Data Validation Strategy

1. **Required Fields**: Core business data that must always be present
2. **Optional Fields**: Enhancement data that can be added later
3. **Enum Validation**: Standardized values to maintain data consistency
4. **Range Validation**: Min/max values for numerical data
5. **Format Validation**: Regex patterns for emails, phone numbers, etc.

### Performance Optimization

1. **Strategic Indexing**: Indexes on frequently queried fields
2. **Composite Indexes**: Multi-field indexes for complex queries
3. **Text Indexes**: Full-text search capabilities where needed
4. **Reference Optimization**: ObjectId references for relationships

### Data Integrity

1. **Middleware**: Pre-save and pre-update hooks for data normalization
2. **Validation**: Comprehensive field validation with clear error messages
3. **Type Safety**: Proper data types and constraints
4. **Relationship Constraints**: Foreign key validation through references

### Development Features

1. **Virtual Fields**: Computed properties that don't persist in database
2. **Instance Methods**: Object-level helper functions
3. **Static Methods**: Collection-level query helpers
4. **Middleware Hooks**: Data processing and validation automation