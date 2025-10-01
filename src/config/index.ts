import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { z } from 'zod';

// Load and expand environment variables
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.preprocess(
    (val) => Number(val),
    z.number().default(4000)
  ),

  // Local Docker MongoDB URI
  MONGODB_LOCAL_URI: z.string().default(
    'mongodb://admin:password@localhost:27017/arambo_properties?authSource=admin'
  ),

  // Atlas MongoDB URI
  MONGODB_ATLAS_URI: z.string().optional(),

  // Explicit override (optional)
  MONGODB_URI: z.string().optional(),

  REDIS_URL: z.string().optional().default('redis://localhost:6379'),
  CORS_ORIGIN: z.string().optional().default('*'),

  // JWT Authentication
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  // Development authentication bypass
  SKIP_AUTH: z.preprocess(
    (val) => val === 'true',
    z.boolean().default(false)
  ),

  // Admin credentials for seeding
  ADMIN_USERNAME: z.string(),
  ADMIN_PASSWORD: z.string(),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    const env = envSchema.parse(process.env);

    // Resolve final MongoDB URI:
    // 1. Use explicit MONGODB_URI if set
    // 2. Else use Atlas in production
    // 3. Else use local Docker Mongo in dev/test
    const finalMongoUri =
      env.MONGODB_URI ||
      (env.NODE_ENV === 'production' ? env.MONGODB_ATLAS_URI : env.MONGODB_LOCAL_URI);

    if (!finalMongoUri) {
      throw new Error(
        '❌ No valid MongoDB URI found. Please set MONGODB_URI, or MONGODB_LOCAL_URI / MONGODB_ATLAS_URI.'
      );
    }

    return {
      ...env,
      MONGODB_URI: finalMongoUri,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
};

export const config = parseEnv();

// Type for the config object
export type Config = z.infer<typeof envSchema> & {
  MONGODB_URI: string; // resolved URI is guaranteed
};

// Export individual config values for convenience
export const { 
  NODE_ENV, 
  PORT, 
  MONGODB_URI, 
  REDIS_URL, 
  CORS_ORIGIN,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  SKIP_AUTH,
  ADMIN_USERNAME,
  ADMIN_PASSWORD
} = config;

// Helper functions
export const isDevelopment = () => NODE_ENV === 'development';
export const isProduction = () => NODE_ENV === 'production';
export const isTest = () => NODE_ENV === 'test';
