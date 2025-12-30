import { logger } from '../logger';

/**
 * Simple rate limiter for API calls
 * In production, use Redis for distributed rate limiting
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry>;
  private configs: Map<string, RateLimitConfig>;

  constructor() {
    this.limits = new Map();
    this.configs = new Map();

    // Default configurations
    this.configs.set('amazon', { maxRequests: 1, windowMs: 1000 }); // 1 req/sec
    this.configs.set('rapidapi', { maxRequests: 10, windowMs: 60000 }); // 10 req/min
    this.configs.set('openai', { maxRequests: 60, windowMs: 60000 }); // 60 req/min
  }

  /**
   * Check if request is allowed
   */
  isAllowed(service: string, identifier?: string): boolean {
    const config = this.configs.get(service);
    if (!config) {
      return true; // No limit configured
    }

    const key = identifier ? `${service}:${identifier}` : service;
    const entry = this.limits.get(key);
    const now = Date.now();

    // Reset if window expired
    if (!entry || now > entry.resetAt) {
      this.limits.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      logger.warn('Rate limit exceeded', { service, identifier, count: entry.count });
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  /**
   * Get remaining requests in current window
   */
  getRemaining(service: string, identifier?: string): number {
    const config = this.configs.get(service);
    if (!config) {
      return Infinity;
    }

    const key = identifier ? `${service}:${identifier}` : service;
    const entry = this.limits.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetAt) {
      return config.maxRequests;
    }

    return Math.max(0, config.maxRequests - entry.count);
  }

  /**
   * Get time until reset
   */
  getResetTime(service: string, identifier?: string): number {
    const key = identifier ? `${service}:${identifier}` : service;
    const entry = this.limits.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetAt) {
      return 0;
    }

    return entry.resetAt - now;
  }

  /**
   * Configure rate limit for a service
   */
  configure(service: string, config: RateLimitConfig): void {
    this.configs.set(service, config);
  }

  /**
   * Clear rate limit for a service/identifier
   */
  clear(service: string, identifier?: string): void {
    const key = identifier ? `${service}:${identifier}` : service;
    this.limits.delete(key);
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug('Rate limiter cleanup', { cleaned, remaining: this.limits.size });
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

