import { createClient } from 'redis';

// Get the Redis URL from environment variables
const redisUrl = process.env.REDIS_URL || process.env.KV_REST_API_URL || process.env.KV_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL is not defined in environment variables');
}

// Create a global redis instance to prevent multiple connections in development
const globalForRedis = global as unknown as { redis: ReturnType<typeof createClient> };

export const redis =
  globalForRedis.redis ||
  createClient({
    url: redisUrl,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));

// Ensure connection is established
if (!redis.isOpen) {
  redis.connect().catch(console.error);
}

export default redis;
