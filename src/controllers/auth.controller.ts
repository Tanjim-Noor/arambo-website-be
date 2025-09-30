import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthService } from '../services/auth.service';
import { 
  LoginRequestSchema, 
  AuthResponse, 
  AuthErrorResponse,
  VerifyTokenResponse 
} from '../validators/auth.validator';

/**
 * Authentication Controller
 * Handles login and token verification endpoints
 */

/**
 * Login endpoint - Authenticate admin and return JWT token
 */
export const login = async (
  req: Request,
  res: Response<AuthResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = LoginRequestSchema.parse(req.body);
    const { username, password } = validatedData;

    // Attempt login
    const result = await AuthService.login(username, password);

    // Set appropriate status code based on result
    const statusCode = result.success ? 200 : 401;
    res.status(statusCode).json(result);

  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      } as AuthErrorResponse);
      return;
    }

    console.error('Login controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An error occurred during login'
    } as AuthErrorResponse);
  }
};

/**
 * Verify token endpoint - Check if current token is valid
 */
export const verifyToken = async (
  req: Request,
  res: Response<VerifyTokenResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // If we reach here, the middleware has already verified the token
    // and populated req.admin
    if (!req.admin) {
      res.status(401).json({
        success: false,
        message: 'Token verification failed'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      admin: {
        id: req.admin.id,
        username: req.admin.username,
        lastLogin: req.admin.lastLogin?.toISOString()
      }
    });

  } catch (error) {
    console.error('Verify token controller error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during token verification'
    });
  }
};

/**
 * Auth status endpoint - Get current authentication status
 */
export const getAuthStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.admin) {
      res.status(200).json({
        authenticated: true,
        admin: {
          id: req.admin.id,
          username: req.admin.username,
          lastLogin: req.admin.lastLogin?.toISOString()
        }
      });
    } else {
      res.status(200).json({
        authenticated: false,
        admin: null
      });
    }
  } catch (error) {
    console.error('Auth status controller error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while checking authentication status'
    });
  }
};

/**
 * Logout endpoint - Simple endpoint for client-side token removal
 * Note: Since we're using stateless JWT, actual logout is handled client-side
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful. Please remove the token from client storage.'
    });
  } catch (error) {
    console.error('Logout controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An error occurred during logout'
    });
  }
};

/**
 * Health check for auth service
 */
export const authHealthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      status: 'OK',
      service: 'Authentication Service',
      message: 'Auth service is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Auth health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      service: 'Authentication Service',
      message: 'Auth service health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};