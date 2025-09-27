# Database Schemas

This folder contains MongoDB schema definitions for all collections in the Arambo Property API.

## Schema Files

### 1. property.schema.js
Complete MongoDB schema for the Property collection including:
- **50+ fields** with comprehensive validation
- **15+ indexes** for optimal query performance
- **Full-text search** configuration
- **Virtual fields** for computed properties
- **Instance/static methods** for common operations
- **Pre/post middleware** for data processing

### 2. truck.schema.js
MongoDB schema for the Truck collection including:
- Basic truck information (model, height, status)
- Validation rules and indexes
- Helper methods for availability checking
- Data normalization middleware

### 3. trip.schema.js
MongoDB schema for the Trip collection including:
- Trip scheduling information
- **Relationship to Truck** collection via ObjectId reference
- Date and time slot validation
- Location-based indexing
- Business logic methods for trip management

### 4. furniture.schema.js
MongoDB schema for the Furniture collection including:
- Furniture request information
- Type and payment method enums
- Contact information validation
- Query helper methods

## Usage

These schema files can be imported and used in your MongoDB/Mongoose models:

```javascript
const mongoose = require('mongoose');
const PropertySchema = require('./schemas/property.schema.js');
const TruckSchema = require('./schemas/truck.schema.js');
const TripSchema = require('./schemas/trip.schema.js');
const FurnitureSchema = require('./schemas/furniture.schema.js');

// Create models
const Property = mongoose.model('Property', PropertySchema);
const Truck = mongoose.model('Truck', TruckSchema);
const Trip = mongoose.model('Trip', TripSchema);
const Furniture = mongoose.model('Furniture', FurnitureSchema);

module.exports = { Property, Truck, Trip, Furniture };
```

## Key Features

### Validation
- Comprehensive field validation with custom error messages
- Enum constraints for standardized values
- Min/max validations for numeric fields
- Email format and phone number validation

### Performance
- Strategic indexing on frequently queried fields
- Composite indexes for complex queries
- Full-text search capabilities (Property schema)

### Data Integrity
- Required field enforcement
- Data normalization through middleware
- Relationship constraints (Trip -> Truck reference)

### Developer Experience
- Rich set of instance and static methods
- Virtual fields for computed properties
- Consistent error handling and validation messages
- Detailed documentation and comments

## Schema Relationships

```
Property (standalone)
Truck (standalone) ←→ Trip (references truckId)
Furniture (standalone)
```

The Trip schema references Truck via `truckId` field, enabling relational queries and population of truck details in trip records.