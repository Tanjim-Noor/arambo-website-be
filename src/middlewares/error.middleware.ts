import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorResponse } from '../validators/property.validator';

// Global error handler middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  console.error('Global error handler:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
    return;
  }

  // Notion API errors
  if (error.code && error.code.startsWith('notion_')) {
    res.status(400).json({
      error: 'Notion API Error',
      message: error.message || 'Failed to communicate with Notion',
      details: { code: error.code },
    });
    return;
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message || 'Something went wrong',
  });
};

// Not found handler
export const notFoundHandler = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

// Request logger middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};