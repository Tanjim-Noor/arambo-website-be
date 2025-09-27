import { Request, Response, NextFunction } from 'express';

// Simple API key authentication middleware
export const requireApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.header('X-API-Key') || req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if API key is provided
  if (!apiKey) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required. Provide it via X-API-Key header or Authorization: Bearer {key}'
    });
    return;
  }

  // For now, using a simple API key. In production, you'd validate against a database
  const validApiKey = process.env.API_KEY || 'arambo-admin-2024';
  
  if (apiKey !== validApiKey) {
    res.status(401).json({
      error: 'Unauthorized', 
      message: 'Invalid API key'
    });
    return;
  }

  // API key is valid, proceed to next middleware
  next();
};

// Optional: Role-based middleware (for future use)
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // This could be extended to check user roles from JWT tokens or database
    // For now, all authenticated users have admin access
    next();
  };
};