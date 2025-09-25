# Furniture API Testing Guide

## Overview
This guide explains how to test the Furniture API endpoints using Postman. The Furniture API provides full CRUD operations for managing furniture items with filtering, pagination, and search capabilities.

## Base URL
```
http://localhost:4000
```

## API Endpoints

### 1. Health Check
- **Method**: GET
- **URL**: `/furniture/health`
- **Description**: Check if the Furniture API is running
- **Expected Response**:
```json
{
  "status": "OK",
  "message": "Furniture API is running",
  "timestamp": "2025-09-26T10:01:53.123Z"
}
```

### 2. Get Statistics
- **Method**: GET
- **URL**: `/furniture/stats`
- **Description**: Get furniture statistics overview
- **Expected Response**:
```json
{
  "total": 15,
  "commercial": 8,
  "residential": 7,
  "available": 12,
  "unavailable": 3,
  "averagePrice": 62133
}
```

### 3. Create Furniture Item
- **Method**: POST
- **URL**: `/furniture`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "01712345678",
  "furnitureType": "Commercial Furniture",
  "paymentType": "EMI Plan",
  "furnitureCondition": "New Furniture",
  "price": 85000,
  "description": "Modern executive desk with built-in storage",
  "location": "Gulshan, Dhaka",
  "brand": "Hatil",
  "furnitureModel": "EXE-2024",
  "quantity": 2,
  "isAvailable": true,
  "images": []
}
```
- **Required Fields**: `name`, `email`, `phone`, `furnitureType`, `price`, `location`, `quantity`
- **Optional Fields**: `paymentType`, `furnitureCondition`, `description`, `brand`, `furnitureModel`, `isAvailable`, `images`

### 4. Get All Furniture Items
- **Method**: GET
- **URL**: `/furniture`
- **Description**: Get all furniture items with pagination
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `sortBy` (optional): Sort field - createdAt, price, name, furnitureType (default: createdAt)
  - `sortOrder` (optional): Sort order - asc, desc (default: desc)

### 5. Get Furniture with Filters
- **Method**: GET
- **URL**: `/furniture?furnitureType=Commercial Furniture&minPrice=50000&maxPrice=100000&isAvailable=true`
- **Available Filters**:
  - `furnitureType`: "Commercial Furniture" or "Residential Furniture"
  - `paymentType`: "EMI Plan", "Lease", or "Instant Pay"
  - `furnitureCondition`: "New Furniture" or "Used Furniture"
  - `minPrice`: Minimum price (number)
  - `maxPrice`: Maximum price (number)
  - `location`: Location search (partial match)
  - `brand`: Brand search (partial match)
  - `isAvailable`: true or false

### 6. Get Furniture by ID
- **Method**: GET
- **URL**: `/furniture/{id}`
- **Description**: Get a specific furniture item by its ID
- **Example**: `/furniture/60f7b3b3b3b3b3b3b3b3b3b3`

### 7. Update Furniture Item
- **Method**: PUT
- **URL**: `/furniture/{id}`
- **Content-Type**: `application/json`
- **Request Body** (all fields optional):
```json
{
  "price": 90000,
  "description": "Updated: Modern executive desk with premium storage",
  "isAvailable": false,
  "paymentType": "Instant Pay"
}
```

### 8. Delete Furniture Item
- **Method**: DELETE
- **URL**: `/furniture/{id}`
- **Description**: Delete a furniture item by ID
- **Expected Response**:
```json
{
  "message": "Furniture item deleted successfully"
}
```

## Enum Values

### Furniture Type (Required)
- `"Commercial Furniture"`
- `"Residential Furniture"`

### Payment Type (Optional)
- `"EMI Plan"`
- `"Lease"`
- `"Instant Pay"`

### Furniture Condition (Optional)
- `"New Furniture"`
- `"Used Furniture"`

## Testing Scenarios in Postman

### Setup
1. Import the `Furniture_API_Testing.postman_collection.json` file
2. Set the environment variable `base_url` to `http://localhost:4000`
3. Ensure the server is running with `npm run dev`

### Test Flow

#### 1. Basic Health Check
```
GET {{base_url}}/furniture/health
```

#### 2. Get Initial Statistics
```
GET {{base_url}}/furniture/stats
```

#### 3. Create a New Furniture Item
```
POST {{base_url}}/furniture
```
**Note**: Copy the `_id` from the response for use in subsequent tests

#### 4. Get All Furniture Items
```
GET {{base_url}}/furniture
```

#### 5. Get Furniture by ID
```
GET {{base_url}}/furniture/{{furniture_id}}
```
Replace `{{furniture_id}}` with the actual ID from step 3

#### 6. Update the Furniture Item
```
PUT {{base_url}}/furniture/{{furniture_id}}
```

#### 7. Test Filtering

**Filter by Commercial Furniture:**
```
GET {{base_url}}/furniture?furnitureType=Commercial Furniture
```

**Filter by Price Range:**
```
GET {{base_url}}/furniture?minPrice=50000&maxPrice=100000
```

**Filter by Payment Type:**
```
GET {{base_url}}/furniture?paymentType=EMI Plan
```

**Filter by Condition:**
```
GET {{base_url}}/furniture?furnitureCondition=New Furniture
```

**Search by Location:**
```
GET {{base_url}}/furniture?location=Dhaka
```

**Search by Brand:**
```
GET {{base_url}}/furniture?brand=Hatil
```

#### 8. Test Pagination and Sorting
```
GET {{base_url}}/furniture?page=1&limit=5&sortBy=price&sortOrder=desc
```

#### 9. Delete Furniture Item
```
DELETE {{base_url}}/furniture/{{furniture_id}}
```

### Error Testing

#### Test Invalid Data
Try creating furniture with invalid data:
```json
{
  "name": "",
  "email": "invalid-email",
  "furnitureType": "Invalid Type",
  "price": -1000
}
```

#### Test Invalid ID
```
GET {{base_url}}/furniture/invalid-id-format
```

#### Test Non-existent ID
```
GET {{base_url}}/furniture/60f7b3b3b3b3b3b3b3b3b3b3
```

## Expected Response Formats

### Success Response (Single Item)
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "01712345678",
  "furnitureType": "Commercial Furniture",
  "paymentType": "EMI Plan",
  "furnitureCondition": "New Furniture",
  "price": 85000,
  "description": "Modern executive desk with built-in storage",
  "location": "Gulshan, Dhaka",
  "brand": "Hatil",
  "furnitureModel": "EXE-2024",
  "quantity": 2,
  "isAvailable": true,
  "images": [],
  "createdAt": "2025-09-26T10:01:53.123Z",
  "updatedAt": "2025-09-26T10:01:53.123Z"
}
```

### Success Response (List with Pagination)
```json
{
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      // ... furniture data
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Error Response
```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": [
    {
      "field": "furnitureType",
      "message": "Furniture type must be either Commercial Furniture or Residential Furniture"
    }
  ]
}
```

## Sample Test Data in Database

The database is seeded with 15 furniture items including:
- 8 Commercial Furniture items
- 7 Residential Furniture items
- Various brands: Hatil, Otobi, Brothers, Partex, RFL
- Price range: BDT 18,000 - BDT 160,000
- Different payment types and conditions
- Various locations in Dhaka

## Tips for Testing

1. **Start with Health Check**: Always verify the API is running
2. **Use Variables**: Set up Postman variables for `base_url` and `furniture_id`
3. **Test Validation**: Try invalid data to test validation rules
4. **Test Pagination**: Use different page sizes and sort orders
5. **Test Filters**: Combine multiple filters to test complex queries
6. **Check Response Format**: Verify all responses match the expected schema
7. **Test Edge Cases**: Empty results, invalid IDs, missing required fields