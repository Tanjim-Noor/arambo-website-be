import { Router } from 'express';
import {
  login,
  verifyToken,
  getAuthStatus,
  logout,
  authHealthCheck,
} from '../controllers/auth.controller';
import { 
  authenticateToken, 
  optionalAuthentication, 
  authRateLimit 
} from '../middlewares/auth.middleware';

const router = Router();

// Public routes (no authentication required)

// Health check endpoint
router.get('/health', authHealthCheck);

// Login endpoint with rate limiting
router.post('/login', authRateLimit(5, 15 * 60 * 1000), login);

// Protected routes (authentication required)

// Verify current token
router.get('/verify', authenticateToken, verifyToken);

// Logout (client-side token removal)
router.post('/logout', authenticateToken, logout);

// Optional authentication routes

// Get authentication status (works with or without token)
router.get('/status', optionalAuthentication, getAuthStatus);

export default router;