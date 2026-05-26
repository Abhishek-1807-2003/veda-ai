import { redisClient } from '../config/redis.js';

// Simple in-memory fallback cache
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  const isRedisAvailable = redisClient.status === 'ready' || redisClient.status === 'connect';
  if (isRedisAvailable) {
    try {
      const raw = await redisClient.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      console.warn('⚠️ Redis cacheGet failed, trying memory fallback:', (err as Error).message);
    }
  }
  
  // Fallback to memory cache
  const cached = memoryCache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  try {
    return JSON.parse(cached.value) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  const isRedisAvailable = redisClient.status === 'ready' || redisClient.status === 'connect';
  if (isRedisAvailable) {
    try {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    } catch (err) {
      console.warn('⚠️ Redis cacheSet failed, falling back to memory:', (err as Error).message);
    }
  }

  // Fallback to memory cache
  memoryCache.set(key, {
    value: JSON.stringify(value),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function cacheDelete(key: string): Promise<void> {
  const isRedisAvailable = redisClient.status === 'ready' || redisClient.status === 'connect';
  if (isRedisAvailable) {
    try {
      await redisClient.del(key);
      return;
    } catch (err) {
      console.warn('⚠️ Redis cacheDelete failed, falling back to memory:', (err as Error).message);
    }
  }

  memoryCache.delete(key);
}
