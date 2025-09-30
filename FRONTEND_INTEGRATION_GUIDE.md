# Frontend Integration Guide for JWT Authentication

## Overview

This guide provides conceptual guidance for integrating the Arambo Backend JWT authentication system with your frontend application . The authentication system has been configured to only protect PUT and DELETE operations, while GET and POST operations remain publicly accessible.

## Table of Contents

1. [Authentication Scope](#authentication-scope)
2. [Authentication Flow](#authentication-flow)
3. [API Integration](#api-integration)
4. [Token Management](#token-management)
5. [Framework Implementation](#framework-implementation)
6. [Error Handling](#error-handling)
7. [Security Best Practices](#security-best-practices)

## Authentication Scope

### Protected vs Public Endpoints

**🔒 Protected Endpoints (Require Authentication):**
- PUT operations: Update existing resources
- DELETE operations: Remove resources

**🔓 Public Endpoints (No Authentication Required):**
- GET operations: Read/retrieve data
- POST operations: Create new resources

### Endpoint Overview

| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| Properties | 🔓 Public | 🔓 Public | 🔒 Protected | 🔒 Protected |
| Trucks | 🔓 Public | 🔓 Public | 🔒 Protected | 🔒 Protected |
| Trips | 🔓 Public | 🔓 Public | 🔒 Protected | 🔒 Protected |
| Furniture | 🔓 Public | 🔓 Public | 🔒 Protected | 🔒 Protected |

## Authentication Flow

## Authentication Flow

### Frontend Authentication Workflow

1. **Public Access**: Users can view and create content without authentication
2. **Admin Login**: Admin logs in for edit/delete operations
3. **Token Management**: JWT token stored securely for protected requests
4. **Selective Protection**: Only edit/delete operations require authentication

### Implementation Strategy

1. **Conditional Authentication**: Check if operation requires authentication
2. **Token Storage**: Store JWT securely (sessionStorage recommended)
3. **Request Interceptors**: Automatically add tokens to protected requests
4. **Error Handling**: Handle token expiration and auth failures gracefully

## API Integration

### Base Configuration

Set up your API client with the following endpoints:

**Authentication Endpoints:**
- `POST /auth/login` - Admin login
- `GET /auth/verify` - Token verification
- `GET /auth/status` - Authentication status
- `POST /auth/logout` - Admin logout
- `GET /auth/health` - Service health check

**Resource Endpoints Pattern:**
- `GET /[resource]` - List items (public)
- `POST /[resource]` - Create item (public)
- `GET /[resource]/:id` - Get specific item (public)
- `PUT /[resource]/:id` - Update item (protected)
- `DELETE /[resource]/:id` - Delete item (protected)

### HTTP Client Setup Concepts

1. **Request Interceptors**: Automatically add authentication headers to protected requests
2. **Response Interceptors**: Handle authentication errors and token expiration
3. **Selective Authentication**: Only add tokens for PUT/DELETE operations
4. **Error Handling**: Graceful fallback for authentication failures

## Token Management

### Storage Options

**Memory Storage (Most Secure):**
- Pros: Immune to XSS attacks
- Cons: Lost on page refresh
- Use case: High-security applications

**SessionStorage (Recommended):**
- Pros: Survives page refresh, cleared on tab close
- Cons: Vulnerable to XSS
- Use case: Balance of security and user experience

**LocalStorage (Least Secure):**
- Pros: Persistent across sessions
- Cons: Vulnerable to XSS, persistent
- Use case: Development only

### Token Validation

Implement client-side token validation:
1. **Expiry Check**: Verify token hasn't expired
2. **Format Validation**: Ensure token structure is valid
3. **Automatic Cleanup**: Remove expired tokens

## Framework Implementation

### React Implementation Strategy

**Key Components:**
1. **Authentication Context**: Manage auth state globally
2. **Login Component**: Handle admin authentication
3. **Protected Route Component**: Guard admin-only pages
4. **HTTP Client**: Handle authenticated requests

**State Management:**
- Use React Context or Redux for auth state
- Track authentication status and admin info
- Handle loading states and errors


## Error Handling

### Common Error Scenarios

**Authentication Errors:**
- Invalid credentials (401)
- Token expired (401)
- Rate limiting (429)
- Server errors (500)

**Network Errors:**
- Connection timeout
- Network unavailable
- CORS issues

### Error Handling Strategy

1. **User-Friendly Messages**: Clear error communication
2. **Automatic Retry**: For network failures
3. **Graceful Degradation**: Continue with public features
4. **Logging**: Track errors for debugging

## Security Best Practices

### Token Security

1. **Secure Storage**: Use sessionStorage over localStorage
2. **Short Expiry**: Default 15-minute token lifetime
3. **Automatic Cleanup**: Remove expired tokens
4. **HTTPS Only**: Never send tokens over HTTP

### Request Security

1. **Selective Headers**: Only add auth headers when needed
2. **Request Validation**: Validate requests before sending
3. **Error Handling**: Don't expose sensitive error details

### Production Considerations

1. **Environment Variables**: Separate dev/prod configurations
2. **CORS Configuration**: Restrict origins in production
3. **Security Headers**: Implement proper security headers
4. **Monitoring**: Track authentication events

