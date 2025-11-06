import { redis } from "@/db/redis"

export async function setRedisData(key: string, payload: string, ttlSeconds?: number): Promise<void> {
  try {
    const value = typeof payload === 'string' ? payload : JSON.stringify(payload);

    if (ttlSeconds) {
      await redis.set(key, value, 'EX', ttlSeconds);
    } else {
      await redis.set(key, value);
    }
  } catch (error) {
    throw error;
  }
}

export async function getRedisData<T = object>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);

    if (value === null) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.error(`Failed to get Redis key "${key}":`, error);
    throw error;
  }
}

