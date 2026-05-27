import Redis from 'ioredis';
import { env } from './env.js';

// Shared Redis options
const redisOptions = {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  retryStrategy(times: number) {
    if (times > 10) {
      console.error('❌ Redis connection failed after 10 retries. Falling back to In-Memory mode.');
      return null; // Stop retrying, sets status to 'end'
    }
    const delay = Math.min(times * 100, 3000);
    console.log(`⏳ Redis reconnect attempt ${times}...`);
    return delay;
  },
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Production: Use REDIS_URL from environment (Upstash format)
// Development: Use REDIS_HOST:REDIS_PORT or fallback to localhost
export const redisClient = env.REDIS_URL 
  ? new Redis(env.REDIS_URL, redisOptions)
  : new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      ...redisOptions,
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
