import Redis from 'ioredis';
import { env } from './env';

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

redisClient.on('error', (err) => {
  console.warn('⚠️ Redis Connection Warning:', err.message);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});
