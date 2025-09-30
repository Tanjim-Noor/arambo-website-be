import * as jwt from 'jsonwebtoken';
import { Admin, IAdmin } from '../database/models/admin.model';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config';
import { JWTPayload, AuthResponse, AuthSuccessResponse, AuthErrorResponse } from '../validators/auth.validator';

/**
 * Authentication Service
 * Handles JWT token generation, validation, and admin authentication
 */
export class AuthService {
  
  /**
   * Authenticate admin with username and password
   */
  static async login(username: string, password: string): Promise<AuthResponse> {
    try {
      // Find admin by username (with password field)
      const admin = await Admin.findByUsername(username);
      
      if (!admin) {
        return {
          success: false,
          error: 'Authentication Failed',
          message: 'Invalid username or password'
        } as AuthErrorResponse;
      }

      // Check if admin is active
      if (!admin.isActive) {
        return {
          success: false,
          error: 'Account Disabled',
          message: 'Your account has been disabled. Please contact support.'
        } as AuthErrorResponse;
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Authentication Failed',
          message: 'Invalid username or password'
        } as AuthErrorResponse;
      }

      // Generate JWT token
      const accessToken = this.generateAccessToken(admin);
      
      // Update last login
      await admin.updateLastLogin();

      return {
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          expiresIn: JWT_EXPIRES_IN,
          admin: {
            id: admin.id,
            username: admin.username,
            lastLogin: admin.lastLogin?.toISOString()
          }
        }
      } as AuthSuccessResponse;

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred during authentication'
      } as AuthErrorResponse;
    }
  }

  /**
   * Generate JWT access token
   */
  static generateAccessToken(admin: IAdmin): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      adminId: admin.id,
      username: admin.username
    };

    return jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN as string,
      issuer: 'arambo-cms-api',
      audience: 'arambo-cms-client'
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token and return decoded payload
   */
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET as string, {
        issuer: 'arambo-cms-api',
        audience: 'arambo-cms-client'
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  /**
   * Get admin by ID (for middleware)
   */
  static async getAdminById(adminId: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findById(adminId);
      
      if (!admin || !admin.isActive) {
        return null;
      }

      return admin;
    } catch (error) {
      console.error('Error getting admin by ID:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(payload: JWTPayload): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    // Check if header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return null;
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);
    
    if (!token || token.trim().length === 0) {
      return null;
    }

    return token.trim();
  }

  /**
   * Validate admin credentials format (for seeding)
   */
  static validateCredentials(username: string, password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Username validation
    if (!username || username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Password validation
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export legacy function names for backward compatibility
export const login = AuthService.login.bind(AuthService);
export const generateAccessToken = AuthService.generateAccessToken.bind(AuthService);
export const verifyAccessToken = AuthService.verifyAccessToken.bind(AuthService);
export const getAdminById = AuthService.getAdminById.bind(AuthService);
export const extractTokenFromHeader = AuthService.extractTokenFromHeader.bind(AuthService);