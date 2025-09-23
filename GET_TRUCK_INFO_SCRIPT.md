# Get Truck Info by ID - Postman Script

## API Endpoint Information

**Base URL:** `http://localhost:4000`  
**Endpoint:** `GET /api/trucks/:id`  
**Method:** GET  
**Content-Type:** application/json

## How to Use with Postman

### Step 1: Start the Server
Before making API calls, ensure your backend server is running:
```bash
npm run dev
```
Server will start on: `http://localhost:4000`

### Step 2: Get Available Truck IDs
First, get a list of all trucks to find valid IDs:

**URL:** `http://localhost:4000/api/trucks`  
**Method:** GET  
**Headers:** None required

**Expected Response:**
```json
[
  {
    "id": "66f06789abcd1234ef567890",
    "modelNumber": "Ford-Transit-2024",
    "height": 2.5,
    "isOpen": false,
    "createdAt": "2024-09-22T...",
    "updatedAt": "2024-09-22T..."
  },
  {
    "id": "66f06789abcd1234ef567891",
    "modelNumber": "Mercedes-Sprinter-2023",
    "height": 3.2,
    "isOpen": true,
    "createdAt": "2024-09-22T...",
    "updatedAt": "2024-09-22T..."
  }
  // ... more trucks
]
```

### Step 3: Get Specific Truck by ID

**URL:** `http://localhost:4000/api/trucks/{TRUCK_ID}`  
**Method:** GET  
**Headers:** None required

**Example URLs:**
- `http://localhost:4000/api/trucks/66f06789abcd1234ef567890`
- `http://localhost:4000/api/trucks/66f06789abcd1234ef567891`

**Expected Response (Success - 200):**
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

**Expected Response (Not Found - 404):**
```json
{
  "error": "Truck not found"
}
```

**Expected Response (Invalid ID - 400):**
```json
{
  "error": "Truck id is required"
}
```

## Postman Collection Script

You can copy this into Postman as a new request:

### Request Configuration:
1. **Method:** GET
2. **URL:** `http://localhost:4000/api/trucks/{{truckId}}`
3. **Headers:** 
   - Content-Type: application/json (optional for GET)

### Environment Variables (Optional):
Create these in Postman Environment:
- `baseUrl`: `http://localhost:4000`
- `truckId`: `66f06789abcd1234ef567890` (replace with actual ID)

Then use: `{{baseUrl}}/api/trucks/{{truckId}}`

## Sample Truck IDs from Seeded Data

After running `npm run db:reset:seed`, you'll have these sample trucks:

1. **Ford Transit 2024** - Closed truck, Height: 2.5m
2. **Mercedes Sprinter 2023** - Open truck, Height: 3.2m  
3. **Isuzu NPR 2022** - Closed truck, Height: 2.8m
4. **Volvo FH16 2024** - Open truck, Height: 4.0m
5. **Scania R450 2023** - Closed truck, Height: 3.5m
6. **MAN TGX 2022** - Open truck, Height: 3.8m
7. **DAF XF 2024** - Closed truck, Height: 3.3m
8. **Renault T High 2023** - Open truck, Height: 4.2m

## Truck Data Structure

Each truck contains:
- **id**: Unique MongoDB ObjectId (string)
- **modelNumber**: Truck model identifier (string)
- **height**: Truck height in meters (number)
- **isOpen**: Whether truck is open/closed type (boolean)
- **createdAt**: Creation timestamp (ISO string)
- **updatedAt**: Last update timestamp (ISO string)

## Error Handling

The API handles these error cases:
- **400 Bad Request**: Invalid or missing truck ID
- **404 Not Found**: Truck doesn't exist in database
- **500 Internal Server Error**: Database or server issues

## Testing Steps

1. **Start server:** `npm run dev`
2. **Seed data:** `npm run db:reset:seed`
3. **Get all trucks:** `GET http://localhost:4000/api/trucks`
4. **Copy a truck ID** from the response
5. **Get specific truck:** `GET http://localhost:4000/api/trucks/{COPIED_ID}`

## Postman Pre-request Script (Optional)

To automatically get a random truck ID before each request:

```javascript
// Pre-request script to get a random truck ID
pm.sendRequest({
    url: pm.environment.get("baseUrl") + "/api/trucks",
    method: 'GET'
}, function (err, response) {
    if (!err && response.code === 200) {
        const trucks = response.json();
        if (trucks.length > 0) {
            const randomTruck = trucks[Math.floor(Math.random() * trucks.length)];
            pm.environment.set("truckId", randomTruck.id);
        }
    }
});
```

## Postman Test Script (Optional)

To validate the response:

```javascript
// Test script to validate truck response
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has truck data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('modelNumber');
    pm.expect(jsonData).to.have.property('height');
    pm.expect(jsonData).to.have.property('isOpen');
    pm.expect(jsonData).to.have.property('createdAt');
    pm.expect(jsonData).to.have.property('updatedAt');
});

pm.test("Height is a positive number", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.height).to.be.a('number');
    pm.expect(jsonData.height).to.be.above(0);
});

pm.test("isOpen is boolean", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.isOpen).to.be.a('boolean');
});
```

---

**Note:** Make sure your backend server is running (`npm run dev`) and database is seeded (`npm run db:reset:seed`) before testing the API endpoints.