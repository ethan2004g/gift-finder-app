export interface Product {
  id: string;
  externalId?: string;
  source: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  productUrl: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  categories?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  source: string;
  query: string;
  cached?: boolean;
  cachedAt?: Date;
}

