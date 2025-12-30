import { ProductAdapter, StandardizedProduct, SearchOptions } from '@/lib/adapters/productAdapter';
import { logger } from '../logger';
import { ApiError } from '../api/error-handler';

/**
 * RapidAPI product search integration
 * Supports multiple product APIs available on RapidAPI
 */
export class RapidApiAdapter implements ProductAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || '';
    this.baseUrl = process.env.RAPIDAPI_BASE_URL || 'https://real-time-amazon-data.p.rapidapi.com';

    if (!this.apiKey) {
      logger.warn('RapidAPI key not configured');
    }
  }

  async search(query: string, options?: SearchOptions): Promise<StandardizedProduct[]> {
    if (!this.apiKey) {
      logger.warn('RapidAPI not configured, returning empty results');
      return [];
    }

    try {
      const url = `${this.baseUrl}/search`;
      const params = new URLSearchParams({
        query,
        page: '1',
        country: 'US',
        ...(options?.limit && { limit: options.limit.toString() }),
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': new URL(this.baseUrl).hostname,
        },
      });

      if (!response.ok) {
        throw new Error(`RapidAPI error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseRapidApiResponse(data);
    } catch (error) {
      logger.error('RapidAPI error', { error, query });
      throw new ApiError(500, 'Failed to search products via RapidAPI');
    }
  }

  async getProduct(productId: string): Promise<StandardizedProduct | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const url = `${this.baseUrl}/product-details`;
      const params = new URLSearchParams({
        asin: productId,
        country: 'US',
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': new URL(this.baseUrl).hostname,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return this.parseRapidApiProduct(data);
    } catch (error) {
      logger.error('RapidAPI error', { error, productId });
      return null;
    }
  }

  /**
   * Parse RapidAPI search response
   */
  private parseRapidApiResponse(data: any): StandardizedProduct[] {
    if (!data.data || !Array.isArray(data.data.products)) {
      return [];
    }

    return data.data.products.map((item: any) => ({
      id: item.asin || `rapidapi-${Date.now()}-${Math.random()}`,
      externalId: item.asin || '',
      source: 'rapidapi',
      title: item.product_title || '',
      description: item.product_description || '',
      price: item.product_price ? parseFloat(item.product_price.replace(/[^0-9.]/g, '')) : undefined,
      currency: 'USD',
      imageUrl: item.product_photo || item.product_main_image_url,
      productUrl: item.product_url || item.product_link,
      rating: item.product_star_rating ? parseFloat(item.product_star_rating) : undefined,
      reviewCount: item.product_num_ratings ? parseInt(item.product_num_ratings) : undefined,
      tags: [],
      categories: item.product_category ? [item.product_category] : [],
      inStock: item.product_availability === 'in stock',
      availability: item.product_availability,
    })).filter((p: StandardizedProduct) => p.title && p.productUrl);
  }

  /**
   * Parse single product from RapidAPI
   */
  private parseRapidApiProduct(data: any): StandardizedProduct | null {
    if (!data.data) {
      return null;
    }

    const item = data.data;
    return {
      id: item.asin || `rapidapi-${Date.now()}`,
      externalId: item.asin || '',
      source: 'rapidapi',
      title: item.product_title || '',
      description: item.product_description || '',
      price: item.product_price ? parseFloat(item.product_price.replace(/[^0-9.]/g, '')) : undefined,
      currency: 'USD',
      imageUrl: item.product_photo || item.product_main_image_url,
      productUrl: item.product_url || item.product_link,
      rating: item.product_star_rating ? parseFloat(item.product_star_rating) : undefined,
      reviewCount: item.product_num_ratings ? parseInt(item.product_num_ratings) : undefined,
      tags: [],
      categories: item.product_category ? [item.product_category] : [],
      inStock: item.product_availability === 'in stock',
      availability: item.product_availability,
    };
  }
}

