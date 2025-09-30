import { z } from 'zod';

// Login request schema
export const LoginRequestSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required')
});

// Login response schema
export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    expiresIn: z.string(),
    admin: z.object({
      id: z.string(),
      username: z.string(),
      lastLogin: z.string().optional()
    })
  }).optional()
});

// JWT payload schema
export const JWTPayloadSchema = z.object({
  adminId: z.string(),
  username: z.string(),
  iat: z.number(),
  exp: z.number()
});

// Auth error response schema
export const AuthErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.string(),
  message: z.string(),
  details: z.any().optional()
});

// Verify token response schema
export const VerifyTokenResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  admin: z.object({
    id: z.string(),
    username: z.string(),
    lastLogin: z.string().optional()
  }).optional()
});

// Extract TypeScript types from schemas
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
export type AuthErrorResponseSchema = z.infer<typeof AuthErrorResponseSchema>;
export type VerifyTokenResponse = z.infer<typeof VerifyTokenResponseSchema>;

// Success response type
export interface AuthSuccessResponse {
  success: true;
  message: string;
  data: {
    accessToken: string;
    expiresIn: string;
    admin: {
      id: string;
      username: string;
      lastLogin?: string;
    };
  };
}

// Error response type
export interface AuthErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: any;
}

// Combined auth response type
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;