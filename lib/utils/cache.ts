import { logger } from '../logger';

/**
 * Simple in-memory cache for AI responses
 * In production, this should be replaced with Redis
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number; // Time to live in milliseconds

  constructor(defaultTTL: number = 24 * 60 * 60 * 1000) {
    // Default: 24 hours
    this.cache = new Map();
    this.defaultTTL = defaultTTL;

    // Clean up expired entries every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug('Cache cleanup', { cleaned, remaining: this.cache.size });
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const cache = new SimpleCache();

/**
 * Generate cache key from parameters
 */
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${JSON.stringify(params[key])}`)
    .join('|');

  return `${prefix}:${Buffer.from(sortedParams).toString('base64').substring(0, 64)}`;
}

