import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('4000'),
  NOTION_TOKEN: z.string().min(1, 'Notion token is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'Notion database ID is required'),
  REDIS_URL: z.string().optional().default('redis://localhost:6379'),
  CORS_ORIGIN: z.string().optional().default('*'),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
};

export const config = parseEnv();

// Type for the config object
export type Config = z.infer<typeof envSchema>;

// Export individual config values for convenience
export const {
  NODE_ENV,
  PORT,
  NOTION_TOKEN,
  NOTION_DATABASE_ID,
  REDIS_URL,
  CORS_ORIGIN,
} = config;

// Helper functions
export const isDevelopment = () => NODE_ENV === 'development';
export const isProduction = () => NODE_ENV === 'production';
export const isTest = () => NODE_ENV === 'test';