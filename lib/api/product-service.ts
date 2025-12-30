import { ProductAdapter, StandardizedProduct, SearchOptions, toProductModel, validateProduct } from '@/lib/adapters/productAdapter';
import { AmazonAdapter } from './amazon';
import { RapidApiAdapter } from './rapidapi';
import { rateLimiter } from './rate-limiter';
import { logger } from '../logger';
import { prisma } from '../prisma';
import { cache, generateCacheKey } from '../utils/cache';
import { ApiError } from '../api/error-handler';

/**
 * Main product service that coordinates multiple ecommerce APIs
 */
export class ProductService {
  private adapters: Map<string, ProductAdapter>;

  constructor() {
    this.adapters = new Map();
    
    // Initialize adapters
    this.adapters.set('amazon', new AmazonAdapter());
    this.adapters.set('rapidapi', new RapidApiAdapter());
  }

  /**
   * Search products across all configured sources
   */
  async searchAll(
    queries: string[],
    options?: SearchOptions,
    sources?: string[]
  ): Promise<Map<string, StandardizedProduct[]>> {
    const results = new Map<string, StandardizedProduct[]>();
    const activeSources = sources || Array.from(this.adapters.keys());

    // Search in parallel with rate limiting
    const searchPromises = activeSources.map(async (source) => {
      const adapter = this.adapters.get(source);
      if (!adapter) {
        return { source, products: [] };
      }

      // Check rate limit
      if (!rateLimiter.isAllowed(source)) {
        logger.warn('Rate limit exceeded, skipping', { source });
        return { source, products: [] };
      }

      try {
        // Try each query until we get results
        for (const query of queries) {
          const cacheKey = generateCacheKey(`product-search:${source}`, { query, options });
          const cached = cache.get<StandardizedProduct[]>(cacheKey);
          
          if (cached) {
            logger.info('Using cached products', { source, query, count: cached.length });
            return { source, products: cached };
          }

          const products = await this.searchWithRetry(adapter, query, options, source);
          
          if (products.length > 0) {
            // Cache results for 1 hour
            cache.set(cacheKey, products, 60 * 60 * 1000);
            return { source, products };
          }
        }

        return { source, products: [] };
      } catch (error) {
        logger.error('Search failed', { source, error });
        return { source, products: [] };
      }
    });

    const searchResults = await Promise.allSettled(searchPromises);

    for (const result of searchResults) {
      if (result.status === 'fulfilled') {
        results.set(result.value.source, result.value.products);
      }
    }

    return results;
  }

  /**
   * Search with retry logic
   */
  private async searchWithRetry(
    adapter: ProductAdapter,
    query: string,
    options: SearchOptions | undefined,
    source: string,
    maxRetries = 2
  ): Promise<StandardizedProduct[]> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const products = await adapter.search(query, options);
        
        // Validate and filter products
        const validProducts = products
          .filter(validateProduct)
          .slice(0, options?.limit || 10);

        // Save to database for caching
        await this.saveProductsToDb(validProducts, source);

        return validProducts;
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        logger.warn('Retrying search', { source, query, attempt: attempt + 1 });
      }
    }

    return [];
  }

  /**
   * Save products to database for caching
   */
  private async saveProductsToDb(
    products: StandardizedProduct[],
    source: string
  ): Promise<void> {
    try {
      const productData = products.map((p) => toProductModel(p, source));

      // Upsert products (avoid duplicates)
      for (const product of productData) {
        await prisma.product.upsert({
          where: {
            externalId_source: {
              externalId: product.externalId || '',
              source: product.source,
            },
          },
          update: {
            title: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            productUrl: product.productUrl,
            rating: product.rating,
            reviewCount: product.reviewCount,
            tags: product.tags,
            categories: product.categories,
            updatedAt: new Date(),
          },
          create: product,
        });
      }
    } catch (error) {
      logger.error('Failed to save products to database', { error, source });
      // Don't throw - saving to DB is not critical for search
    }
  }

  /**
   * Get product by ID from a specific source
   */
  async getProduct(source: string, productId: string): Promise<StandardizedProduct | null> {
    const adapter = this.adapters.get(source);
    if (!adapter) {
      return null;
    }

    if (!rateLimiter.isAllowed(source)) {
      throw new ApiError(429, 'Rate limit exceeded');
    }

    try {
      return await adapter.getProduct(productId);
    } catch (error) {
      logger.error('Get product failed', { source, productId, error });
      return null;
    }
  }

  /**
   * Get available sources
   */
  getAvailableSources(): string[] {
    return Array.from(this.adapters.keys());
  }
}

// Export singleton instance
export const productService = new ProductService();

