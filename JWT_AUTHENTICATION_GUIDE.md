# JWT Authentication Implementation Guide

## Overview

This document describes the JWT authentication and authorization system implemented in the Arambo Website Backend. The system provides secure admin access to protected CMS endpoints using JSON Web Tokens (JWT).

## System Architecture

### Authentication Flow
1. **Admin Login** → Username/Password verification → JWT token generation
2. **Protected Requests** → JWT token validation → Admin authorization
3. **Token Expiry** → Client must re-authenticate

### Security Features
- ✅ Password hashing with bcrypt (salt rounds: 12)
- ✅ JWT tokens with short expiry (15 minutes)
- ✅ Rate limiting on login attempts (5 attempts per 15 minutes)
- ✅ Secure token validation with issuer/audience verification
- ✅ Admin account status checking (active/inactive)
- ✅ Environment-based configuration

## Authentication Endpoints

### Base URL: `/auth`

#### 1. **Health Check**
```
GET /auth/health
```
**Response:**
```json
{
  "status": "OK",
  "service": "Authentication Service",
  "message": "Auth service is running",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### 2. **Login**
```
POST /auth/login
```
**Request Body:**
```json
{
  "username": "admin",
  "password": "your-password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m",
    "admin": {
      "id": "60d5ec49f1b2c8b1a8e4e1a1",
      "username": "admin",
      "lastLogin": "2024-03-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Authentication Failed",
  "message": "Invalid username or password"
}
```

**Rate Limit Response (429):**
```json
{
  "success": false,
  "error": "Too Many Attempts",
  "message": "Too many login attempts. Please try again in 15 minutes."
}
```

#### 3. **Verify Token**
```
GET /auth/verify
Authorization: Bearer <token>
```
**Success Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "admin": {
    "id": "60d5ec49f1b2c8b1a8e4e1a1",
    "username": "admin",
    "lastLogin": "2024-03-15T10:30:00.000Z"
  }
}
```

#### 4. **Auth Status**
```
GET /auth/status
Authorization: Bearer <token> (optional)
```
**Authenticated Response:**
```json
{
  "authenticated": true,
  "admin": {
    "id": "60d5ec49f1b2c8b1a8e4e1a1",
    "username": "admin",
    "lastLogin": "2024-03-15T10:30:00.000Z"
  }
}
```

**Unauthenticated Response:**
```json
{
  "authenticated": false,
  "admin": null
}
```

#### 5. **Logout**
```
POST /auth/logout
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Logout successful. Please remove the token from client storage."
}
```

## Protected Endpoints

The following endpoints now require authentication:

### Properties
- ✅ `POST /properties` - Create property
- ✅ `PUT /properties/:id` - Update property  
- ✅ `DELETE /properties/:id` - Delete property
- 🔓 `GET /properties` - List properties (public)
- 🔓 `GET /properties/:id` - Get property (public)

### Trucks
- ✅ `POST /trucks` - Create truck
- ✅ `PUT /trucks/:id` - Update truck
- ✅ `DELETE /trucks/:id` - Delete truck
- 🔓 `GET /trucks` - List trucks (public)
- 🔓 `GET /trucks/:id` - Get truck (public)

### Trips
- ✅ `POST /trips` - Create trip
- ✅ `PUT /trips/:id` - Update trip
- ✅ `DELETE /trips/:id` - Delete trip
- 🔓 `GET /trips` - List trips (public)
- 🔓 `GET /trips/:id` - Get trip (public)

### Furniture
- ✅ `POST /furniture` - Create furniture
- ✅ `PUT /furniture/:id` - Update furniture
- ✅ `DELETE /furniture/:id` - Delete furniture
- 🔓 `GET /furniture` - List furniture (public)
- 🔓 `GET /furniture/:id` - Get furniture (public)

## Admin Management

### Creating Admin User

#### Environment Variables
Add to your `.env` file:
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

# Admin Credentials (for seeding)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

#### Seed Admin User
```bash
# Create admin user
npm run seed:admin

# Reset admin user (delete and recreate)
npm run seed:admin:reset

# List all admin users
npm run seed:admin:list

# Update admin password (via script)
ts-node src/database/seeds/admin.seed.ts update-password newpassword123
```

### Admin User Schema

```typescript
interface IAdmin {
  username: string;        // Unique username
  password: string;        // Bcrypt hashed password
  isActive: boolean;       // Account status
  lastLogin?: Date;        // Last login timestamp
  createdAt: Date;         // Account creation
  updatedAt: Date;         // Last update
}
```

## Environment Configuration

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/arambo_properties_dev

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Optional: Development settings
NODE_ENV=development
SKIP_AUTH=false  # Set to true to bypass auth in development
```

### Production Security Considerations

1. **JWT_SECRET**: Use a strong, random secret (minimum 32 characters)
2. **ADMIN_PASSWORD**: Use a strong password (minimum 12 characters)
3. **JWT_EXPIRES_IN**: Keep token expiry short (15-30 minutes)
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Configure appropriate rate limits
6. **Password Policy**: Enforce strong password requirements

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication Required",
  "message": "Access token is required. Please provide a valid Bearer token."
}
```

#### 401 Invalid Token
```json
{
  "success": false,
  "error": "Invalid Token",
  "message": "The provided token is invalid or expired."
}
```

#### 401 Token Expired
```json
{
  "success": false,
  "error": "Token Expired",
  "message": "Your access token has expired. Please login again."
}
```

#### 400 Validation Error
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": [
    {
      "field": "username",
      "message": "Username is required"
    }
  ]
}
```

## Database Schema

### Admin Collection

```javascript
{
  _id: ObjectId,
  username: String,      // Unique, lowercase, 3-50 chars
  password: String,      // Bcrypt hashed, min 6 chars
  isActive: Boolean,     // Default: true
  lastLogin: Date,       // Optional
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### Indexes
- `username` (unique)
- `isActive`
- `lastLogin` (descending)

## Middleware Types

### 1. `authenticateToken`
**Usage:** Protects routes that require authentication
```typescript
router.post('/protected', authenticateToken, controller);
```

### 2. `optionalAuthentication`  
**Usage:** Adds admin info if token is present, continues without if missing
```typescript
router.get('/stats', optionalAuthentication, controller);
```

### 3. `authRateLimit`
**Usage:** Rate limits authentication attempts
```typescript
router.post('/login', authRateLimit(5, 15 * 60 * 1000), login);
```

## Testing

### Manual Testing Script

Create `test-auth.js`:
```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testAuth() {
  try {
    // 1. Health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/auth/health`);
    console.log('✅ Health:', health.data.status);

    // 2. Login
    console.log('2. Testing login...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Login successful');
    
    const token = login.data.data.accessToken;

    // 3. Verify token
    console.log('3. Testing token verification...');
    const verify = await axios.get(`${BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Token verified');

    // 4. Test protected route
    console.log('4. Testing protected route...');
    try {
      await axios.post(`${BASE_URL}/properties`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      if (error.response.status === 400) {
        console.log('✅ Protected route accessible (validation error expected)');
      }
    }

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();
```

Run with: `node test-auth.js`

## Troubleshooting

### Common Issues

1. **"Admin user not found"**
   - Run `npm run seed:admin` to create admin user

2. **"Invalid JWT token"**
   - Check JWT_SECRET in environment variables
   - Verify token hasn't expired (15 minutes default)

3. **"Connection to database failed"**
   - Verify MongoDB is running
   - Check MONGODB_URI in environment variables

4. **"Rate limit exceeded"**
   - Wait 15 minutes or restart server
   - Check for too many failed login attempts

5. **"CORS error"**
   - Verify CORS_ORIGIN includes your frontend URL
   - Check Authorization header is being sent

### Debug Mode

Set environment variables for debugging:
```env
NODE_ENV=development
DEBUG=true
```

## Security Best Practices

1. **Rotate JWT Secrets** regularly in production
2. **Monitor failed login attempts** for security threats
3. **Use HTTPS** for all authentication requests
4. **Store tokens securely** on client-side (not localStorage)
5. **Implement token refresh** for better UX (optional)
6. **Log authentication events** for audit trails
7. **Regular security audits** of authentication flow

## Next Steps

Consider implementing these enhancements:

1. **Refresh Tokens** - For longer sessions without re-authentication
2. **Multi-Factor Authentication (MFA)** - Additional security layer
3. **Role-Based Access Control (RBAC)** - Different permission levels
4. **Session Management** - Track active sessions
5. **Password Reset** - Self-service password reset via email
6. **Account Lockout** - Temporary lockout after failed attempts
7. **Audit Logging** - Track all authentication events