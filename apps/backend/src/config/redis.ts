import Redis from 'ioredis';
import { env } from './env.js';

// Single shared ioredis instance — never create new connections per request
export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('⚠️ Redis connection failed. Falling back to In-Memory mode.');
      return null; // Stop retrying, sets status to 'end'
    }
    return Math.min(times * 100, 2000);
  },
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('error', (err) => {
  // Only log if we haven't stopped retrying
  if (redisClient.status !== 'end') {
    console.error('❌ Redis error:', err.message);
  }
});
