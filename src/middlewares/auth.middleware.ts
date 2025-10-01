import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthErrorResponse } from '../validators/auth.validator';

// Extend Express Request interface to include admin
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        username: string;
        lastLogin?: Date;
      };
    }
  }
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token and adds admin info to request object
 */
export const authenticateToken = async (
  req: Request,
  res: Response<AuthErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = AuthService.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication Required',
        message: 'Access token is required. Please provide a valid Bearer token.'
      });
      return;
    }

    // Verify token
    const payload = AuthService.verifyAccessToken(token);
    
    if (!payload) {
      res.status(401).json({
        success: false,
        error: 'Invalid Token',
        message: 'The provided token is invalid or expired.'
      });
      return;
    }

    // Check if token is expired (additional check)
    if (AuthService.isTokenExpired(payload)) {
      res.status(401).json({
        success: false,
        error: 'Token Expired',
        message: 'Your access token has expired. Please login again.'
      });
      return;
    }

    // Get admin from database
    const admin = await AuthService.getAdminById(payload.adminId);
    
    if (!admin) {
      res.status(401).json({
        success: false,
        error: 'Invalid Admin',
        message: 'The admin associated with this token no longer exists or is disabled.'
      });
      return;
    }

    // Add admin info to request object
    req.admin = {
      id: admin.id,
      username: admin.username,
      ...(admin.lastLogin && { lastLogin: admin.lastLogin })
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An error occurred during authentication'
    });
  }
};

/**
 * Optional authentication middleware
 * Adds admin info if token is present and valid, but doesn't block if missing
 */
export const optionalAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthService.extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    const payload = AuthService.verifyAccessToken(token);
    
    if (!payload || AuthService.isTokenExpired(payload)) {
      // Invalid or expired token, continue without authentication
      next();
      return;
    }

    const admin = await AuthService.getAdminById(payload.adminId);
    
    if (admin) {
      req.admin = {
        id: admin.id,
        username: admin.username,
        ...(admin.lastLogin && { lastLogin: admin.lastLogin })
      };
    }

    next();
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    // On error, continue without authentication
    next();
  }
};

/**
 * Development middleware to skip authentication in development mode
 * WARNING: Only use in development environment
 */
export const developmentAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') {
    // In development mode with SKIP_AUTH=true, create a mock admin
    req.admin = {
      id: 'dev-admin-id',
      username: 'dev-admin'
    };
    console.warn('⚠️ Development mode: Authentication bypassed');
  }
  
  next();
};

/**
 * Rate limiting middleware for auth endpoints
 */
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response<AuthErrorResponse>, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    for (const [ip, data] of attempts.entries()) {
      if (now > data.resetTime) {
        attempts.delete(ip);
      }
    }

    const clientData = attempts.get(clientIP);
    
    if (!clientData) {
      // First attempt
      attempts.set(clientIP, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (clientData.count >= maxAttempts) {
      res.status(429).json({
        success: false,
        error: 'Too Many Attempts',
        message: `Too many login attempts. Please try again in ${Math.ceil((clientData.resetTime - now) / 60000)} minutes.`
      });
      return;
    }

    // Increment attempt count
    clientData.count++;
    next();
  };
};