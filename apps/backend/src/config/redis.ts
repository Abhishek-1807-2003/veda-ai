import Redis from 'ioredis';
import { env } from './env.js';

// Production: Use REDIS_URL from environment (Upstash format)
// Development: Use REDIS_HOST:REDIS_PORT or fallback to localhost
const redisConfig = env.REDIS_URL 
  ? env.REDIS_URL
  : {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    };

// Single shared ioredis instance — never create new connections per request
export const redisClient = new Redis(redisConfig, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  retryStrategy(times) {
    if (times > 10) {
      console.error('❌ Redis connection failed after 10 retries. Falling back to In-Memory mode.');
      return null; // Stop retrying, sets status to 'end'
    }
    const delay = Math.min(times * 100, 3000);
    console.log(`⏳ Redis reconnect attempt ${times}...`);
    return delay;
  },
  // Add connection timeout
  connectTimeout: 10000,
  commandTimeout: 5000,
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('ready', () => {
  console.log('✅ Redis ready to accept commands');
});

redisClient.on('error', (err) => {
  // Only log if we haven't stopped retrying
  if (redisClient.status !== 'end') {
    console.error('❌ Redis error:', err.message);
  }
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

// Export a helper to check Redis status
export function isRedisConnected(): boolean {
  return redisClient.status === 'ready';
}
