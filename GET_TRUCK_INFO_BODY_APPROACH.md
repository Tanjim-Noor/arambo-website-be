# Get Truck Info by ID - Request Body Approach

## Two API Approaches Available

### Approach 1: URL Parameter (Current Implementation)
**URL:** `GET http://localhost:4000/api/trucks/{id}`
**Body:** None

### Approach 2: Request Body (Alternative Implementation)
**URL:** `POST http://localhost:4000/api/trucks/get-by-id`
**Body:** `{ "id": "truck_id_here" }`

---

## Postman Setup for Request Body Approach

### Method 1: Using Existing Endpoint with URL Parameter

**Request Configuration:**
- **Method:** GET
- **URL:** `http://localhost:4000/api/trucks/66f06789abcd1234ef567890`
- **Body:** None required

### Method 2: Request Body Approach (If Implemented)

**Request Configuration:**
- **Method:** POST
- **URL:** `http://localhost:4000/api/trucks/get-by-id`
- **Headers:** 
  - Content-Type: application/json
- **Body (raw JSON):**
```json
{
  "id": "66f06789abcd1234ef567890"
}
```

## Postman Body Configuration Steps

### For Request Body Approach:

1. **Set Method:** POST
2. **Set URL:** `http://localhost:4000/api/trucks/get-by-id`
3. **Go to Headers tab:**
   - Key: `Content-Type`
   - Value: `application/json`

4. **Go to Body tab:**
   - Select: `raw`
   - Select: `JSON` from dropdown
   - Enter:
   ```json
   {
     "id": "66f06789abcd1234ef567890"
   }
   ```

## Sample Request Bodies

### Get Specific Truck:
```json
{
  "id": "66f06789abcd1234ef567890"
}
```

### With Additional Filters (If Extended):
```json
{
  "id": "66f06789abcd1234ef567890",
  "includeTrips": true
}
```

## Expected Responses

### Success Response (200):
```json
{
  "id": "66f06789abcd1234ef567890",
  "modelNumber": "Ford-Transit-2024",
  "height": 2.5,
  "isOpen": false,
  "createdAt": "2024-09-22T19:30:45.123Z",
  "updatedAt": "2024-09-22T19:30:45.123Z"
}
```

### Error Responses:

**Missing ID (400):**
```json
{
  "error": "Truck ID is required in request body"
}
```

**Invalid ID Format (400):**
```json
{
  "error": "Invalid truck ID format"
}
```

**Truck Not Found (404):**
```json
{
  "error": "Truck not found"
}
```

## Advantages of Each Approach

### URL Parameter Approach (Current):
✅ **Pros:**
- RESTful convention
- Cacheable requests
- Simple browser testing
- Standard HTTP GET semantics

❌ **Cons:**
- ID visible in URL/logs
- Limited additional parameters

### Request Body Approach:
✅ **Pros:**
- ID hidden from URL/logs
- Can send complex query parameters
- More flexible for additional filters
- Better for sensitive data

❌ **Cons:**
- Not RESTful for simple ID lookup
- Requires POST method
- Not cacheable
- More complex setup

## Implementation Code (If You Want to Add This)

If you'd like me to implement the request body approach, here's what would be needed:

### New Route:
```typescript
router.post('/get-by-id', getTruckByIdFromBody);
```

### New Controller Method:
```typescript
export const getTruckByIdFromBody = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Truck ID is required in request body' });
    }
    const truck = await TruckService.getTruckById(String(id));
    if (truck) {
      return res.json(truck);
    } else {
      return res.status(404).json({ error: 'Truck not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch truck', details: err });
  }
};
```

## Postman Collection Examples

### Collection 1: URL Parameter (Current)
```json
{
  "name": "Get Truck by ID (URL)",
  "request": {
    "method": "GET",
    "url": "http://localhost:4000/api/trucks/{{truckId}}"
  }
}
```

### Collection 2: Request Body (Alternative)
```json
{
  "name": "Get Truck by ID (Body)",
  "request": {
    "method": "POST",
    "url": "http://localhost:4000/api/trucks/get-by-id",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"id\": \"{{truckId}}\"\n}"
    }
  }
}
```

## Environment Variables for Both Approaches

Set these in Postman Environment:
- `baseUrl`: `http://localhost:4000`
- `truckId`: `66f06789abcd1234ef567890`

### URLs:
- **URL Parameter:** `{{baseUrl}}/api/trucks/{{truckId}}`
- **Request Body:** `{{baseUrl}}/api/trucks/get-by-id`

## Testing Both Approaches

1. **Start server:** `npm run dev`
2. **Seed data:** `npm run db:reset:seed`
3. **Test URL approach:** `GET /api/trucks/{id}`
4. **Test Body approach:** `POST /api/trucks/get-by-id` with JSON body

---

**Recommendation:** For simple truck lookup by ID, the URL parameter approach (current implementation) is more RESTful and standard. The request body approach is better when you need to send complex queries or sensitive data.

Would you like me to implement the request body approach in addition to the existing URL parameter method?