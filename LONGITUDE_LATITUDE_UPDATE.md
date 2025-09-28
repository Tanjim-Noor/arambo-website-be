# Longitude and Latitude Fields Update

## Summary
Added longitude and latitude fields to the Property model to store precise GPS coordinates for each property listing.

## Changes Made

### 1. Database Model (`property.model.ts`)
- Added `longitude?: number` and `latitude?: number` fields to the `IProperty` interface
- Added validation constraints:
  - Longitude: -180 to 180 (valid longitude range)
  - Latitude: -90 to 90 (valid latitude range)
- Added compound index `{ longitude: 1, latitude: 1 }` for efficient coordinate queries

### 2. Validation Schema (`property.validator.ts`)
- Added longitude and latitude fields to `PropertySchema` with range validation
- Added coordinate filter fields to `PropertyFiltersSchema`:
  - `longitude` - exact match
  - `latitude` - exact match  
  - `minLongitude`, `maxLongitude` - range filtering
  - `minLatitude`, `maxLatitude` - range filtering

### 3. Service Layer (`property.service.ts`)
- Added longitude/latitude support in query filters
- Added bounding box search capability using min/max coordinate filters
- Updated `convertToResponse` method to include coordinate fields

### 4. Database Migration
Created migration `20250928000000-add-longitude-latitude-fields.js` to add these fields to existing properties (initially set to null).

## API Usage Examples

### Creating a Property with Coordinates
```json
POST /api/properties
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+8801234567890",
  "propertyName": "Apartment in Gulshan",
  "longitude": 90.4152,
  "latitude": 23.7937,
  ...
}
```

### Filtering by Exact Coordinates
```
GET /api/properties?longitude=90.4152&latitude=23.7937
```

### Filtering by Coordinate Range (Bounding Box)
```
GET /api/properties?minLongitude=90.4&maxLongitude=90.5&minLatitude=23.7&maxLatitude=23.8
```

### Updating Property Coordinates  
```json
PUT /api/properties/:id
{
  "longitude": 90.4200,
  "latitude": 23.8000
}
```

## Coordinate System
- Uses WGS84 coordinate system (standard GPS coordinates)
- Longitude: East-West position (-180° to +180°)
- Latitude: North-South position (-90° to +90°)

## Common Coordinate Ranges for Dhaka
- Longitude: ~90.3° to 90.5° 
- Latitude: ~23.7° to 23.9°

## Use Cases
1. **Map Integration**: Display properties on interactive maps
2. **Location-based Search**: Find properties near specific coordinates
3. **Distance Calculations**: Calculate distance between properties and points of interest
4. **Geofencing**: Filter properties within specific geographic boundaries
5. **Analytics**: Analyze property distribution patterns

## Testing
- Run `node test-longitude-latitude.js` for basic MongoDB tests
- Run `node test-coordinates-api.js` for comprehensive API tests
- Execute migration: `npm run migrate` to add fields to existing data

## Notes
- Coordinates are optional fields (can be null)
- Invalid coordinate values will be rejected with validation errors  
- Indexes are optimized for both exact match and range queries
- Consider adding 2dsphere index for advanced geospatial queries in the future