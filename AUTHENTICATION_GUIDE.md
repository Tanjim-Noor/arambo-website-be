# Authentication Guide

## Overview

The Arambo Backend API now uses API key authentication to protect sensitive endpoints while keeping public read access available.

## Endpoint Access Levels

### 🌐 Public Endpoints (No Authentication Required)
- `GET /properties` - List all properties
- `GET /properties/:id` - Get property details  
- `GET /properties/health` - Health check
- `GET /properties/stats` - Property statistics
- `GET /trucks` - List all trucks
- `GET /trucks/:id` - Get truck details
- `POST /trucks/get-by-id` - Get truck by ID from body
- `GET /trips` - List all trips
- `GET /trips/:id` - Get trip details
- `GET /trips/date` - Get trips by date
- `GET /trips/truck/:truckId` - Get trips by truck
- `GET /trips/timeslot/:timeSlot` - Get trips by time slot
- `GET /furniture` - List all furniture
- `GET /furniture/:id` - Get furniture details
- `GET /furniture/health` - Health check
- `GET /furniture/stats` - Furniture statistics

### 🔒 Private Endpoints (Require API Key)
- `POST /properties` - Create property
- `PUT /properties/:id` - Update property
- `POST /trucks` - Create truck
- `PUT /trucks/:id` - Update truck
- `DELETE /trucks/:id` - Delete truck
- `POST /trips` - Create trip
- `PUT /trips/:id` - Update trip
- `DELETE /trips/:id` - Delete trip
- `POST /furniture` - Create furniture
- `PUT /furniture/:id` - Update furniture
- `DELETE /furniture/:id` - Delete furniture

## Using API Keys

### Method 1: X-API-Key Header
```bash
curl -H "X-API-Key: arambo-admin-2024" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Property"}' \
     http://localhost:4000/properties
```

### Method 2: Authorization Bearer Token  
```bash
curl -H "Authorization: Bearer arambo-admin-2024" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Property"}' \
     http://localhost:4000/properties
```

### JavaScript/Frontend Example
```javascript
// Using fetch with API key
const response = await fetch('http://localhost:4000/properties', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'arambo-admin-2024'
  },
  body: JSON.stringify({
    name: 'Test Property',
    // ... other property data
  })
});
```

## Configuration

### Environment Variables
Add to your `.env` file:
```bash
API_KEY=your-secure-api-key-here
```

### Default Development Key
For development: `arambo-admin-2024`

**⚠️ Important:** Change the API key in production!

## Testing Authentication

Run the authentication test script:
```bash
node test-auth.js
```

This will test:
1. Public endpoints work without API key
2. Private endpoints are blocked without API key  
3. Private endpoints work with valid API key

## Error Responses

### 401 Unauthorized (No API Key)
```json
{
  "error": "Unauthorized",
  "message": "API key is required. Provide it via X-API-Key header or Authorization: Bearer {key}"
}
```

### 401 Unauthorized (Invalid API Key)
```json
{
  "error": "Unauthorized", 
  "message": "Invalid API key"
}
```

## Security Best Practices

1. **Never expose API keys in frontend code**
2. **Use environment variables for API keys**
3. **Rotate API keys regularly in production**  
4. **Consider implementing JWT tokens for user-specific authentication**
5. **Use HTTPS in production**

## Future Enhancements

- JWT-based authentication for user sessions
- Role-based access control (admin, user, etc.)
- API key expiration and rotation
- Rate limiting per API key
- Audit logging for authenticated actions