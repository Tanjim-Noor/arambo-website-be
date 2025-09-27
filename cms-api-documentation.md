# CMS API Documentation & v0.dev Prompt Generation

## Complete API Reference

### Base Information
- **API Base URL**: `http://localhost:PORT` (PORT from environment variables)
- **Content-Type**: `application/json`
- **API Version**: 1.0.0
- **Database**: MongoDB
- **Authentication**: None (public API)

---

## API Endpoints

### Properties API (`/properties`)

#### `GET /properties` - List Properties
**Description**: Retrieve properties with filtering, sorting, and pagination

**Query Parameters**:
- `page` (number, optional, default: 1): Page number for pagination
- `limit` (number, optional, default: 10, max: 100): Items per page
- `category` (string|array, optional): Filter by category
  - Values: `'Furnished'`, `'Semi-Furnished'`, `'Non-Furnished'`
- `listingType` (string|array, optional): Filter by listing type
  - Values: `'For Rent'`, `'For Sale'`
- `propertyType` (string|array, optional): Filter by property type
  - Values: `'Apartment'`, `'House'`, `'Villa'`
- `bedrooms` (string, optional): Bedroom filter (exact: `'3'` or minimum: `'3+'`)
- `bathroom` (string, optional): Bathroom filter (exact: `'2'` or minimum: `'2+'`)
- `minSize` (number, optional): Minimum property size
- `maxSize` (number, optional): Maximum property size
- `location` (string, optional): Location search string
- `area` (string|array, optional): Filter by specific area
  - Values: `'Aftabnagar'`, `'Banani'`, `'Gulshan 1'`, `'Uttara Sector 1'`, etc. (see full list below)
- `firstOwner` (boolean, optional): Filter by first owner properties
- `onLoan` (boolean, optional): Filter by loan status
- `isConfirmed` (boolean, optional): Filter by confirmation status
- `inventoryStatus` (string|array, optional): Filter by inventory status
  - Values: `'Looking for Rent'`, `'Found Tenant'`, `'Owner Unreachable'`
- `tenantType` (string|array, optional): Filter by tenant type
  - Values: `'Family'`, `'Bachelor'`, `'Women'`
- `propertyCategory` (string|array, optional): Filter by property category
  - Values: `'Residential'`, `'Commercial'`
- `furnishingStatus` (string|array, optional): Filter by furnishing status
  - Values: `'Non-Furnished'`, `'Semi-Furnished'`, `'Furnished'`
- `minRent` (number, optional): Minimum rent amount
- `maxRent` (number, optional): Maximum rent amount
- `floor` (number, optional): Specific floor number
- `houseId` (string, optional): Filter by house ID
- `listingId` (string, optional): Filter by listing ID
- `apartmentType` (string, optional): Filter by apartment type
- `isVerified` (boolean, optional): Filter by verification status
- Facility filters (all boolean, optional):
  - `cctv`, `communityHall`, `gym`, `masjid`, `parking`, `petsAllowed`, `swimmingPool`, `trainedGuard`

**Response Structure**:
```json
{
  "properties": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "propertyName": "string",
      "listingType": "For Rent|For Sale",
      "propertyType": "Apartment|House|Villa",
      "size": 1200,
      "location": "string",
      "bedrooms": 3,
      "bathroom": 2,
      "baranda": 1,
      "category": "Furnished|Semi-Furnished|Non-Furnished",
      "notes": "string",
      "firstOwner": false,
      "lift": true,
      "isConfirmed": false,
      "paperworkUpdated": false,
      "onLoan": false,
      "houseId": "string",
      "streetAddress": "string",
      "landmark": "string",
      "area": "string",
      "listingId": "string",
      "inventoryStatus": "Looking for Rent|Found Tenant|Owner Unreachable",
      "tenantType": "Family|Bachelor|Women",
      "propertyCategory": "Residential|Commercial",
      "furnishingStatus": "Non-Furnished|Semi-Furnished|Furnished",
      "availableFrom": "2023-12-01T00:00:00.000Z",
      "floor": 5,
      "totalFloor": 10,
      "yearOfConstruction": 2020,
      "rent": 25000,
      "serviceCharge": 3000,
      "advanceMonths": 2,
      "cleanHygieneScore": 8,
      "sunlightScore": 7,
      "bathroomConditionsScore": 9,
      "cctv": true,
      "communityHall": false,
      "gym": true,
      "masjid": false,
      "parking": true,
      "petsAllowed": false,
      "swimmingPool": false,
      "trainedGuard": true,
      "coverImage": "https://example.com/image.jpg",
      "otherImages": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
      "apartmentType": "Studio",
      "isVerified": false,
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  ],
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

#### `POST /properties` - Create Property
**Description**: Create a new property listing

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01234567890",
  "propertyName": "Luxury Apartment in Gulshan",
  "listingType": "For Rent",
  "propertyType": "Apartment",
  "size": 1200,
  "location": "Gulshan 2, Dhaka",
  "bedrooms": 3,
  "bathroom": 2,
  "baranda": 1,
  "category": "Furnished",
  "notes": "Newly renovated apartment",
  "firstOwner": true,
  "lift": true,
  "isConfirmed": false,
  // ... all other optional fields
}
```

**Response**: Same as single property object above with 201 status

#### `GET /properties/:id` - Get Property by ID
**Description**: Retrieve a single property by its ID

**Path Parameters**:
- `id` (string, required): Property ID

**Response**: Single property object (200) or error (404)

#### `PUT /properties/:id` - Update Property
**Description**: Update an existing property

**Path Parameters**:
- `id` (string, required): Property ID

**Request Body**: Partial property object (any fields can be updated)

**Response**: Updated property object (200) or error (404)

#### `GET /properties/health` - Health Check
**Response**:
```json
{
  "status": "OK",
  "message": "Arambo Property API is running",
  "timestamp": "2023-12-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

#### `GET /properties/stats` - Property Statistics
**Response**:
```json
{
  "total": 150,
  "byCategory": {
    "Furnished": 50,
    "Semi-Furnished": 75,
    "Non-Furnished": 25
  },
  "byPropertyType": {
    "Apartment": 120,
    "House": 25,
    "Villa": 5
  },
  "avgSize": 1200,
  "avgBedrooms": 2.8
}
```

---

### Trucks API (`/trucks`)

#### `GET /trucks` - List All Trucks
**Response**:
```json
[
  {
    "id": "string",
    "modelNumber": "TR-001",
    "height": 12.5,
    "isOpen": true,
    "description": "Large cargo truck",
    "createdAt": "2023-12-01T00:00:00.000Z",
    "updatedAt": "2023-12-01T00:00:00.000Z"
  }
]
```

#### `POST /trucks` - Create Truck
**Request Body**:
```json
{
  "modelNumber": "TR-002",
  "height": 15.0,
  "isOpen": false,
  "description": "Heavy duty truck"
}
```

#### `GET /trucks/:id` - Get Truck by ID
**Path Parameters**: `id` (string, required)

#### `POST /trucks/get-by-id` - Get Truck by ID from Body
**Request Body**:
```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

#### `PUT /trucks/:id` - Update Truck
**Request Body**: Partial truck object

#### `DELETE /trucks/:id` - Delete Truck
**Response**: `{ "success": true }` or error

---

### Trips API (`/trips`)

#### `GET /trips` - List All Trips
**Response**:
```json
[
  {
    "id": "string",
    "name": "John Smith",
    "phone": "01234567890",
    "email": "john@example.com",
    "productType": "Fragile",
    "pickupLocation": "Dhaka",
    "dropOffLocation": "Chittagong",
    "preferredDate": "2023-12-15T00:00:00.000Z",
    "preferredTimeSlot": "Morning (8AM - 12PM)",
    "additionalNotes": "Handle with care",
    "truckId": "507f1f77bcf86cd799439011",
    "createdAt": "2023-12-01T00:00:00.000Z",
    "updatedAt": "2023-12-01T00:00:00.000Z"
  }
]
```

#### `POST /trips` - Create Trip
**Request Body**:
```json
{
  "name": "John Smith",
  "phone": "01234567890",
  "email": "john@example.com",
  "productType": "Perishable Goods|Non-Perishable Goods|Fragile|Other",
  "pickupLocation": "Dhaka University",
  "dropOffLocation": "Chittagong Port",
  "preferredDate": "2023-12-15",
  "preferredTimeSlot": "Morning (8AM - 12PM)|Afternoon (12PM - 4PM)|Evening (4PM - 8PM)",
  "additionalNotes": "Special handling required",
  "truckId": "507f1f77bcf86cd799439011"
}
```

#### `GET /trips/:id` - Get Trip by ID
#### `PUT /trips/:id` - Update Trip
#### `DELETE /trips/:id` - Delete Trip
#### `GET /trips/truck/:truckId` - Get Trips by Truck ID
#### `GET /trips/date?date=YYYY-MM-DD` - Get Trips by Date
#### `GET /trips/timeslot/:timeSlot` - Get Trips by Time Slot

---

### Furniture API (`/furniture`)

#### `GET /furniture` - List Furniture Items
**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `sortBy` (string, default: 'createdAt'): Values: `'createdAt'`, `'name'`, `'furnitureType'`
- `sortOrder` (string, default: 'desc'): Values: `'asc'`, `'desc'`

**Response**:
```json
{
  "data": [
    {
      "_id": "string",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01234567890",
      "furnitureType": "Commercial Furniture|Residential Furniture",
      "paymentType": "EMI Plan|Lease|Instant Pay",
      "furnitureCondition": "New Furniture|Used Furniture",
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### `POST /furniture` - Create Furniture Item
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01234567890",
  "furnitureType": "Commercial Furniture",
  "paymentType": "EMI Plan",
  "furnitureCondition": "New Furniture"
}
```

#### `GET /furniture/:id` - Get Furniture Item by ID
#### `PUT /furniture/:id` - Update Furniture Item
#### `DELETE /furniture/:id` - Delete Furniture Item

#### `GET /furniture/health` - Health Check
#### `GET /furniture/stats` - Furniture Statistics

---

## Data Models

### Property Model
**Required Fields**:
- `name`: string (1-100 chars) - Contact person name
- `email`: string (valid email format)
- `phone`: string (10-15 digits)
- `propertyName`: string (1-200 chars)
- `size`: number (1-100000) - Property size in sq ft
- `location`: string (1-300 chars)
- `bedrooms`: number (0-50)
- `bathroom`: number (0-50)
- `category`: enum ['Furnished', 'Semi-Furnished', 'Non-Furnished']

**Optional Fields**:
- `listingType`: enum ['For Rent', 'For Sale']
- `propertyType`: enum ['Apartment', 'House', 'Villa']
- `baranda`: number (≥0, default: 0)
- `notes`: string (≤1000 chars)
- `firstOwner`: boolean (default: false)
- `lift`: boolean (default: false)
- `isConfirmed`: boolean (default: false)
- `paperworkUpdated`: boolean (default: false)
- `onLoan`: boolean (default: false)
- `houseId`: string (≤50 chars)
- `streetAddress`: string (≤500 chars)
- `landmark`: string (≤300 chars)
- `area`: enum (see available areas below)
- `listingId`: string (≤50 chars)
- `inventoryStatus`: enum ['Looking for Rent', 'Found Tenant', 'Owner Unreachable']
- `tenantType`: enum ['Family', 'Bachelor', 'Women']
- `propertyCategory`: enum ['Residential', 'Commercial']
- `furnishingStatus`: enum ['Non-Furnished', 'Semi-Furnished', 'Furnished']
- `availableFrom`: Date
- `floor`: number (0-200)
- `totalFloor`: number (1-200)
- `yearOfConstruction`: number (1800-currentYear+5)
- `rent`: number (0-10000000)
- `serviceCharge`: number (0-1000000)
- `advanceMonths`: number (0-24)
- `cleanHygieneScore`: number (1-10)
- `sunlightScore`: number (1-10)
- `bathroomConditionsScore`: number (1-10)
- Facility fields (all boolean, default: false):
  - `cctv`, `communityHall`, `gym`, `masjid`, `parking`, `petsAllowed`, `swimmingPool`, `trainedGuard`
- `coverImage`: string (≤500 chars) - URL
- `otherImages`: array of strings (max 20 items)
- `apartmentType`: string (≤100 chars)
- `isVerified`: boolean (default: false)

**Available Areas**:
'Aftabnagar', 'Banani', 'Banani DOHs', 'Banashree', 'Banasree', 'Baridhara DOHs', 'Baridhara J Block', 'Bashundhara Residential', 'Dhanmondi', 'DIT & Merul Badda', 'Greenroad', 'Gudaraghat', 'Gulshan 1', 'Gulshan 2', 'Lalmatia', 'Middle Badda', 'Mirpur DOHs', 'Mohakhali Amtoli', 'Mohakhali DOHs', 'Mohakhali TB Gate', 'Mohakhali Wireless', 'Mohanagar Project', 'Niketan', 'Nikunja 1', 'Nikunja 2', 'North Badda', 'Notun Bazar', 'Shahjadpur Beside & near Suvastu', 'Shahjadpur Lakeside', 'Shanti Niketan', 'South Badda', 'South Banasree', 'Uttara Sector 1-18'

### Truck Model
**Fields**:
- `modelNumber`: string (required, 1-100 chars, indexed)
- `height`: number (required, 1-100, indexed)
- `isOpen`: boolean (required, indexed)
- `description`: string (optional, ≤500 chars)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

### Trip Model
**Fields**:
- `name`: string (required, 1-100 chars, indexed)
- `phone`: string (required, 10-15 digits, indexed)
- `email`: string (required, valid email, indexed)
- `productType`: enum (required, indexed) ['Perishable Goods', 'Non-Perishable Goods', 'Fragile', 'Other']
- `pickupLocation`: string (required, ≤300 chars, indexed)
- `dropOffLocation`: string (required, ≤300 chars, indexed)
- `preferredDate`: Date (required, indexed)
- `preferredTimeSlot`: enum (required, indexed) ['Morning (8AM - 12PM)', 'Afternoon (12PM - 4PM)', 'Evening (4PM - 8PM)']
- `additionalNotes`: string (optional, ≤500 chars)
- `truckId`: ObjectId (required, indexed, references Truck)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

### Furniture Model
**Fields**:
- `name`: string (required, ≤100 chars)
- `email`: string (required, valid email)
- `phone`: string (required)
- `furnitureType`: enum (required, indexed) ['Commercial Furniture', 'Residential Furniture']
- `paymentType`: enum (optional, indexed) ['EMI Plan', 'Lease', 'Instant Pay']
- `furnitureCondition`: enum (optional, indexed) ['New Furniture', 'Used Furniture']
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error Type",
  "message": "Human readable message",
  "details": [
    {
      "field": "fieldName",
      "message": "Specific validation error"
    }
  ]
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **500**: Internal Server Error

---

## Technical Stack
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schemas
- **Security**: Helmet middleware, CORS
- **Logging**: Morgan
- **Error Handling**: Custom error middleware

---

# V0.dev CMS Creation Prompt

Create a comprehensive Content Management System for the Arambo Property API using the following specifications:

## Tech Stack Requirements
- **Framework**: [Next.js 15.5.4](https://www.npmjs.com/package/next) with App Router  
- **Language**: TypeScript   
- **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)  
- **UI Components**: [shadcn/ui](https://github.com/birobirobiro/awesome-shadcn-ui) (latest, compatible with Next.js 15 & Tailwind v4)  
- **Form Handling**: [React Hook Form v7.63.0](https://www.npmjs.com/package/react-hook-form) with [Zod v4.1.11](https://www.npmjs.com/package/zod) and `@hookform/resolvers`  
- **HTTP Client**: Fetch API (built-in) or [Axios (latest)](https://www.npmjs.com/package/axios) with error handling  
- **State Management**: [TanStack Query v5.90.3](https://github.com/tanstack/query/releases) for server state  
- **Icons**: [Lucide React v0.544.0](https://www.npmjs.com/package/lucide-react)  

## Application Structure

### 1. Layout & Navigation
Create a responsive layout with:
- **Sidebar Navigation** with the following menu items:
  - Dashboard (overview stats)
  - Properties
    - Unconfirmed Properties
    - Confirmed Properties
  - Trips Management
  - Trucks Management
  - Furniture Requests
- **Top Bar** with:
  - Breadcrumb navigation
  - Dark/Light mode toggle
  - User profile placeholder
- **Mobile-responsive** hamburger menu for smaller screens

### 2. Dashboard Page (`/dashboard`)
Create an overview dashboard with:
- **Summary Cards**:
  - Total Properties (with confirmed/unconfirmed breakdown)
  - Total Trips (with status indicators)
  - Active Trucks
  - Furniture Requests
- **Charts/Graphs** (using recharts or similar):
  - Properties by Category (pie chart)
  - Monthly Trends (line chart)
  - Area Distribution (bar chart)
- **Recent Activity** feed showing latest additions

### 3. Properties Management

#### Unconfirmed Properties Page (`/properties/unconfirmed`)
- **Data Table** with the following features:
  - Columns: Property Name, Location, Contact Name, Phone, Email, Category, Bedrooms, Rent, Created Date, Actions
  - **Sorting**: All columns clickable for sorting
  - **Filtering**: Advanced filter panel with:
    - Search by property name/location
    - Category dropdown (Furnished/Semi-Furnished/Non-Furnished)
    - Property type dropdown (Apartment/House/Villa)
    - Bedroom range selector
    - Area multiselect dropdown
    - Date range picker
    - Rent range slider
  - **Pagination**: Show 10/25/50 items per page
  - **Bulk Actions**: Select multiple items for batch confirmation
- **Actions per row**:
  - View Details (modal or drawer)
  - Edit (navigate to edit page)
  - Confirm Property (change isConfirmed to true)
  - Delete (with confirmation dialog)

#### Confirmed Properties Page (`/properties/confirmed`)
- Same table structure as unconfirmed but with:
  - Additional "Verified" status column
  - Bulk actions for marking as unconfirmed
  - Export functionality (CSV/Excel)

### 4. Property CRUD Operations

#### Create Property Page (`/properties/new`)
**Multi-step Form** with the following sections:

**Step 1: Basic Information**
- Contact Name* (required)
- Email* (required, validated)
- Phone* (required, 10-15 digits)
- Property Name* (required)

**Step 2: Property Details**
- Listing Type (For Rent/For Sale)
- Property Type (Apartment/House/Villa)
- Size* (required, number input with validation)
- Location* (required, text area)
- Bedrooms* (required, number selector)
- Bathrooms* (required, number selector)
- Baranda (number selector, default 0)
- Category* (required, dropdown)

**Step 3: Additional Details**
- House ID
- Street Address
- Landmark
- Area (searchable dropdown from predefined list)
- Listing ID
- Inventory Status (dropdown)
- Tenant Type (dropdown)
- Property Category (Residential/Commercial)
- Furnishing Status (dropdown)
- Available From (date picker)
- Floor / Total Floor (number inputs)
- Year of Construction (year picker)
- Rent / Service Charge / Advance Months (number inputs)

**Step 4: Amenities & Scores**
- Clean Hygiene Score (1-10 slider)
- Sunlight Score (1-10 slider)
- Bathroom Conditions Score (1-10 slider)
- **Facilities** (toggle switches):
  - CCTV, Community Hall, Gym, Masjid, Parking, Pets Allowed, Swimming Pool, Trained Guard

**Step 5: Images & Final**
- Cover Image (file upload or URL)
- Other Images (multiple file upload, max 20)
- Apartment Type
- Notes (text area)
- Is Verified (checkbox)
- Form Review Summary

#### Edit Property Page (`/properties/edit/[id]`)
- Same form as create but pre-populated with existing data
- Show "Last Updated" timestamp
- Option to mark as confirmed/unconfirmed

### 5. Trips Management Page (`/trips`)
**Full CRUD Interface**:
- **Data Table** with columns:
  - Name, Contact Info, Product Type, Pickup Location, Drop-off Location, Preferred Date, Time Slot, Truck, Status, Actions
- **Filtering Options**:
  - Product Type dropdown
  - Date range picker
  - Time slot filter
  - Truck selection
  - Search by name/location
- **Create Trip Form** with:
  - Contact Information (Name*, Email*, Phone*)
  - Trip Details (Product Type*, Pickup*, Drop-off*, Preferred Date*, Time Slot*)
  - Truck Selection (dropdown with truck details)
  - Additional Notes
- **Edit/Delete functionality** with confirmation dialogs

### 6. Trucks Management Page (`/trucks`)
**Full CRUD Interface**:
- **Data Table** with columns:
  - Model Number, Height, Status (Open/Closed), Description, Created Date, Actions
- **Create/Edit Truck Form**:
  - Model Number* (required, unique validation)
  - Height* (required, number input with unit display)
  - Status* (Open/Closed toggle)
  - Description (text area)
- **Delete functionality** with checks for associated trips

### 7. Furniture Requests Page (`/furniture`)
**Full CRUD Interface**:
- **Data Table** with columns:
  - Name, Contact Info, Furniture Type, Payment Type, Condition, Created Date, Actions
- **Filtering Options**:
  - Furniture Type dropdown
  - Payment Type dropdown
  - Condition dropdown
  - Date range picker
- **Create/Edit Forms** with all furniture fields
- **Statistics Cards** showing request breakdowns

## UI/UX Requirements

### Design Principles
- **Clean & Professional**: Minimal design with ample whitespace
- **Consistent**: Use shadcn/ui components consistently
- **Responsive**: Mobile-first approach, works on all screen sizes
- **Accessible**: Proper ARIA labels, keyboard navigation, color contrast

### Interactive Elements
- **Loading States**: Skeleton loaders for data fetching
- **Error States**: Clear error messages with retry options
- **Success States**: Toast notifications for successful actions
- **Empty States**: Helpful illustrations and calls-to-action
- **Confirmation Dialogs**: For destructive actions (delete, bulk operations)

### Data Table Requirements
- **Fixed Headers**: Headers remain visible during scroll
- **Row Selection**: Checkboxes for bulk operations
- **Hover Effects**: Subtle row highlighting
- **Action Buttons**: Consistent styling (Edit/View/Delete icons)
- **Status Badges**: Color-coded status indicators
- **Responsive**: Stack/hide columns on mobile

### Form Requirements
- **Real-time Validation**: Show errors as user types
- **Field Dependencies**: Show/hide fields based on selections
- **Auto-save**: Save drafts for long forms
- **Required Field Indicators**: Clear visual markers
- **Help Text**: Tooltips for complex fields
- **Progress Indicators**: For multi-step forms

## API Integration

### Base Configuration
```typescript
// api/config.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Error Handling
- **Global Error Handler**: Interceptor for API errors
- **Retry Logic**: Automatic retry for network failures  
- **Error Boundaries**: Catch component errors
- **User-Friendly Messages**: Convert API errors to readable text

## File Structure
```
src/
├── app/
│   ├── dashboard/
│   ├── properties/
│   │   ├── unconfirmed/
│   │   ├── confirmed/
│   │   ├── new/
│   │   └── edit/[id]/
│   ├── trips/
│   ├── trucks/
│   └── furniture/
├── components/
│   ├── ui/ (shadcn components)
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── layout/
├── hooks/
├── lib/
│   ├── api.ts
│   ├── validations.ts
│   └── utils.ts
├── types/
└── constants/
```

## Implementation Notes

1. **Start with the basic layout and navigation**
2. **Implement one CRUD module completely (Properties) as a template**
3. **Add comprehensive error handling and loading states**
4. **Ensure responsive design works across all components**
5. **Add proper TypeScript types for all API responses**
6. **Implement proper form validation matching the API schemas**
7. **Add proper testing for critical user flows**

This CMS should provide a complete interface for managing all aspects of the Arambo Property API with a professional, user-friendly interface suitable for daily operations.