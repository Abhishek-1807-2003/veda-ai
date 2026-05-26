import { z } from 'zod';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env file only if it exists (won't fail in production where env vars are set via Railway)
if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(__dirname, '../../.env') });
}

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database
  MONGO_URI: z.string().default('mongodb://localhost:27017/vedaai'),
  
  // Redis (supports both separate host/port and connection URL)
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  
  // JWT
  JWT_SECRET: z.string().default('dev-secret-replace-me'),
  
  // AI Provider
  AI_PROVIDER: z.enum(['openai', 'anthropic', 'together']).default('openai'),
  AI_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  TOGETHER_API_KEY: z.string().optional(),
  
  // WebSocket
  WS_PORT: z.coerce.number().default(4000), // Use same port as HTTP on Railway
  
  // Frontend URL for CORS
  FRONTEND_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  console.error('❌ Invalid environment variables:', errors);
  
  // In production, fail fast
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
  // In development, warn but continue with defaults
  console.warn('⚠️  Using default values for missing environment variables');
}

export const env = parsed.data || {
  PORT: 4000,
  NODE_ENV: 'development',
  MONGO_URI: 'mongodb://localhost:27017/vedaai',
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
  JWT_SECRET: 'dev-secret-replace-me',
  AI_PROVIDER: 'openai',
  AI_MODEL: 'gpt-4o-mini',
  WS_PORT: 4000,
};
