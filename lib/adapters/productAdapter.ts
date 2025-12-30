import { Product } from '@/types/product';

/**
 * Standardized product interface for all ecommerce sources
 */
export interface StandardizedProduct {
  id: string;
  externalId: string;
  source: string;
  title: string;
  description?: string;
  price?: number;
  currency: string;
  imageUrl?: string;
  productUrl: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  categories?: string[];
  inStock?: boolean;
  availability?: string;
}

/**
 * Adapter interface for different ecommerce APIs
 */
export interface ProductAdapter {
  search(query: string, options?: SearchOptions): Promise<StandardizedProduct[]>;
  getProduct(productId: string): Promise<StandardizedProduct | null>;
}

export interface SearchOptions {
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: 'relevance' | 'price' | 'rating';
}

/**
 * Convert standardized product to database Product model
 */
export function toProductModel(
  product: StandardizedProduct,
  source: string
): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    externalId: product.externalId,
    source,
    title: product.title,
    description: product.description,
    price: product.price,
    currency: product.currency || 'USD',
    imageUrl: product.imageUrl,
    productUrl: product.productUrl,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tags: product.tags || [],
    categories: product.categories || [],
  };
}

/**
 * Validate and sanitize product data
 */
export function validateProduct(product: StandardizedProduct): boolean {
  if (!product.title || !product.productUrl) {
    return false;
  }

  if (product.price !== undefined && product.price < 0) {
    return false;
  }

  if (product.rating !== undefined && (product.rating < 0 || product.rating > 5)) {
    return false;
  }

  return true;
}

/**
 * Normalize product title (remove extra spaces, etc.)
 */
export function normalizeTitle(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 500); // Max length
}

/**
 * Extract categories from product data
 */
export function extractCategories(
  product: StandardizedProduct,
  keywords?: string[]
): string[] {
  const categories: string[] = [];

  if (product.categories) {
    categories.push(...product.categories);
  }

  // Try to infer from title/description
  const text = `${product.title} ${product.description || ''}`.toLowerCase();

  const categoryKeywords: Record<string, string[]> = {
    Electronics: ['electronic', 'tech', 'device', 'gadget', 'smartphone', 'tablet', 'laptop'],
    Fashion: ['clothing', 'apparel', 'fashion', 'wear', 'outfit', 'dress', 'shirt'],
    Books: ['book', 'novel', 'reading', 'author', 'publisher'],
    Sports: ['sport', 'fitness', 'exercise', 'athletic', 'outdoor'],
    Gaming: ['game', 'gaming', 'console', 'controller', 'gamer'],
    Home: ['home', 'kitchen', 'furniture', 'decor', 'appliance'],
    Beauty: ['beauty', 'cosmetic', 'makeup', 'skincare', 'perfume'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      categories.push(category);
    }
  }

  return Array.from(new Set(categories));
}

