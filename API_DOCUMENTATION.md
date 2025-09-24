# Arambo Property API Documentation

## Overview

The Arambo Property API is a RESTful service for managing real estate property listings. This API supports full CRUD operations, advanced filtering, search functionality, and pagination for efficient data retrieval suitable for infinite scroll implementations.

**Base URL:** `http://localhost:4000`

**Current Version:** 1.0.0

## Table of Contents

1. [Authentication](#authentication)
2. [Response Format](#response-format)
3. [Error Handling](#error-handling)
4. [Pagination](#pagination)
5. [Endpoints](#endpoints)
   - [Health Check](#health-check)
   - [Properties](#properties)
   - [Property Statistics](#property-statistics)
6. [Data Models](#data-models)
7. [Frontend Integration Examples](#frontend-integration-examples)

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent JSON format:

### Success Response
```json
{
  "properties": [...],
  "total": 150,
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalItems": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2
  }
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Human readable error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Specific validation error"
    }
  ]
}
```

## Error Handling

The API uses standard HTTP status codes:

- **200 OK** - Successful GET, PUT requests
- **201 Created** - Successful POST requests
- **400 Bad Request** - Invalid request parameters or validation errors
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side errors

## Pagination

The API supports pagination for the GET `/properties` endpoint to enable infinite scroll and efficient data loading.

### Pagination Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | - | Page number (1-based) |
| `limit` | integer | 10 | 100 | Number of items per page |

### Pagination Response

```json
{
  "pagination": {
    "currentPage": 2,
    "limit": 10,
    "totalItems": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": true,
    "nextPage": 3,
    "prevPage": 1
  }
}
```

**For Infinite Scroll Implementation:**
- Use `hasNextPage` to determine if more data is available
- Use `nextPage` for the next API call
- Append new results to existing data

## Endpoints

### Health Check

#### GET `/properties/health`

Check if the API service is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Arambo Property API is running",
  "timestamp": "2025-09-22T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Properties

#### GET `/properties`

Retrieve property listings with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (default: 1) | `?page=2` |
| `limit` | integer | Items per page (default: 10, max: 100) | `?limit=20` |
| `category` | string | Property category | `?category=sale` |
| `listingType` | string | Listing type (for Rent, for Sale) | `?listingType=for%20Rent` |
| `propertyType` | string | Property type (apartment, house, villa) | `?propertyType=apartment` |
| `bedrooms` | integer | Number of bedrooms | `?bedrooms=3` |
| `minSize` | integer | Minimum size in sq ft | `?minSize=1000` |
| `maxSize` | integer | Maximum size in sq ft | `?maxSize=2000` |
| `location` | string | Location search (partial match) | `?location=mumbai` |
| `area` | string | Area search (partial match) | `?area=bandra` |
| `firstOwner` | boolean | First owner properties | `?firstOwner=true` |
| `onLoan` | boolean | Properties on loan | `?onLoan=false` |
| `inventoryStatus` | string | Inventory status | `?inventoryStatus=Available` |
| `tenantType` | string | Preferred tenant type | `?tenantType=Family` |
| `propertyCategory` | string | Property category | `?propertyCategory=Residential` |
| `furnishingStatus` | string | Furnishing status | `?furnishingStatus=Furnished` |
| `minRent` | integer | Minimum rent amount | `?minRent=25000` |
| `maxRent` | integer | Maximum rent amount | `?maxRent=50000` |
| `floor` | integer | Specific floor number | `?floor=5` |
| `houseId` | string | House ID search | `?houseId=H001` |
| `listingId` | string | Listing ID search | `?listingId=L001` |
| `isConfirmed` | boolean | Show confirmed/unconfirmed properties | `?isConfirmed=false` |

**Note**: By default, the API only returns properties where `isConfirmed` is `true`. To see unconfirmed properties, explicitly set `isConfirmed=false`.

**Example Request:**
```
GET /properties?page=1&limit=10&category=rent&listingType=for%20Rent&propertyType=apartment&bedrooms=2&minRent=20000&maxRent=40000&location=mumbai
```

**Response:**
```json
{
  "properties": [
    {
      "id": "614f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "propertyName": "Sea View Apartment",
      "listingType": "for Rent",
      "propertyType": "Apartment",
      "size": 1200,
      "location": "Bandra West, Mumbai",
      "bedrooms": 2,
      "bathroom": 2,
      "baranda": true,
      "category": "rent",
      "notes": "Sea facing apartment with parking",
      "firstOwner": true,
      "lift": true,
      "isConfirmed": true,
      "paperworkUpdated": true,
      "onLoan": false,
      "houseId": "H001",
      "streetAddress": "123 Carter Road",
      "landmark": "Near Bandstand",
      "area": "Bandra",
      "listingId": "L001",
      "inventoryStatus": "Available",
      "tenantType": "Family",
      "propertyCategory": "Residential",
      "furnishingStatus": "Semi-Furnished",
      "availableFrom": "2025-10-01T00:00:00.000Z",
      "floor": 5,
      "totalFloor": 12,
      "yearOfConstruction": 2018,
      "rent": 35000,
      "serviceCharge": 2000,
      "advanceMonths": 3,
      "cleanHygieneScore": 9,
      "sunlightScore": 8,
      "bathroomConditionsScore": 9,
      "coverImage": "https://example.com/image1.jpg",
      "otherImages": [
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
      ],
      "createdAt": "2025-09-22T10:00:00.000Z",
      "updatedAt": "2025-09-22T10:00:00.000Z"
    }
  ],
  "total": 1,
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

#### POST `/properties`

Create a new property listing.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "propertyName": "Modern Villa",
  "listingType": "for Sale",
  "propertyType": "Villa",
  "size": 2500,
  "location": "Juhu, Mumbai",
  "bedrooms": 4,
  "bathroom": 3,
  "baranda": true,
  "category": "sale",
  "notes": "Luxury villa with garden",
  "firstOwner": true,
  "lift": false,
  "paperworkUpdated": true,
  "onLoan": false,
  "houseId": "H002",
  "streetAddress": "456 Juhu Tara Road",
  "landmark": "Near Juhu Beach",
  "area": "Juhu",
  "listingId": "L002",
  "inventoryStatus": "Available",
  "tenantType": "Family",
  "propertyCategory": "Residential",
  "furnishingStatus": "Furnished",
  "availableFrom": "2025-11-01T00:00:00.000Z",
  "floor": 0,
  "totalFloor": 2,
  "yearOfConstruction": 2020,
  "rent": 0,
  "serviceCharge": 0,
  "advanceMonths": 0,
  "cleanHygieneScore": 10,
  "sunlightScore": 9,
  "bathroomConditionsScore": 10,
  "coverImage": "https://example.com/villa1.jpg",
  "otherImages": [
    "https://example.com/villa2.jpg"
  ]
}
```

**Response:** Returns the created property with generated ID and timestamps.

#### GET `/properties/:id`

Retrieve a specific property by ID.

**Parameters:**
- `id` (string): Property ID

**Response:** Returns a single property object or 404 if not found.

#### PUT `/properties/:id`

Update an existing property.

**Parameters:**
- `id` (string): Property ID

**Request Body:** Partial property object with fields to update.

**Response:** Returns the updated property object.

### Property Statistics

#### GET `/properties/stats`

Get aggregated statistics about all properties.

**Response:**
```json
{
  "total": 150,
  "byCategory": {
    "rent": 80,
    "sale": 60,
    "lease": 10
  },
  "byPropertyType": {
    "Apartment": 90,
    "House": 30,
    "Villa": 20
  },
  "avgSize": 1450,
  "avgBedrooms": 2.3
}
```

## Data Models

### Property

```typescript
interface Property {
  // Required fields
  name: string;                    // Owner/contact name
  email: string;                   // Contact email
  phone: string;                   // Contact phone
  propertyName: string;            // Property title
  listingType?: ListingType;       // for Rent, for Sale
  propertyType?: PropertyType;     // apartment, house, villa
  size: number;                    // Size in square feet
  location: string;                // Property location
  bedrooms: number;                // Number of bedrooms
  bathroom: number;                // Number of bathrooms
  baranda: boolean;               // Has balcony
  category: Category;             // rent, sale, lease, buy
  firstOwner: boolean;            // Is first owner
  lift: boolean;                  // Has elevator
  isConfirmed: boolean;           // Property listing confirmed
  paperworkUpdated: boolean;      // Paperwork status
  onLoan: boolean;               // Property on loan

  // Optional fields
  notes?: string;                 // Additional notes
  houseId?: string;              // House identifier
  streetAddress?: string;         // Street address
  landmark?: string;             // Nearby landmark
  area?: string;                 // Area/locality
  listingId?: string;            // Listing identifier
  inventoryStatus?: InventoryStatus;
  tenantType?: TenantType;
  propertyCategory?: PropertyCategory;
  furnishingStatus?: FurnishingStatus;
  availableFrom?: string;        // ISO date string
  floor?: number;                // Floor number
  totalFloor?: number;           // Total floors in building
  yearOfConstruction?: number;   // Construction year
  rent?: number;                 // Monthly rent
  serviceCharge?: number;        // Monthly service charge
  advanceMonths?: number;        // Advance payment months
  cleanHygieneScore?: number;    // 1-10 rating
  sunlightScore?: number;        // 1-10 rating
  bathroomConditionsScore?: number; // 1-10 rating
  coverImage?: string;           // Cover image URL
  otherImages?: string[];        // Additional image URLs

  // System fields
  id: string;                    // Auto-generated ID
  createdAt: string;             // ISO date string
  updatedAt: string;             // ISO date string
}
```

### Enums

```typescript
// Listing types
type ListingType = 'for Rent' | 'for Sale';

// Property types
type PropertyType = 'Apartment' | 'House' | 'Villa';

// Categories
type Category = 'sale' | 'rent' | 'lease' | 'buy';

// Inventory status
type InventoryStatus = 'Looking for Rent' | 'Looking for Sale' | 
                      'Looking for Lease' | 'Available' | 'Rented' | 
                      'Sold' | 'Leased' | 'Unavailable';

// Tenant types
type TenantType = 'Family' | 'Bachelor' | 'Office' | 'Commercial' | 'Any';

// Property categories
type PropertyCategory = 'Residential' | 'Commercial' | 'Industrial' | 'Mixed';

// Furnishing status
type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Non-Furnished';
```

## Rate Limiting and Best Practices

1. **Pagination**: Always use pagination for listing endpoints. Default limit is 10, maximum is 100.

2. **Filtering**: Combine multiple filters to reduce response size and improve performance.

3. **Caching**: Consider implementing client-side caching for frequently accessed data.

4. **Error Handling**: Always handle errors gracefully and display meaningful messages to users.

5. **Loading States**: Implement proper loading states for better user experience.

6. **Debouncing**: For search inputs, implement debouncing to avoid excessive API calls.

## CORS Configuration

The API supports CORS and accepts requests from configured origins. Default configuration allows:
- All origins in development
- Specific origins in production
- Credentials are supported
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS

## Support

For API support or questions, please contact the development team or refer to the source code repository.

---

**Last Updated:** September 22, 2025  
**API Version:** 1.0.0