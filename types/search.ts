import { ProductSearchResult } from './product';

export interface RecipientData {
  relationship?: string;
  ageRange?: string;
  gender?: string;
  interests?: string[];
  likes?: string[];
  dislikes?: string[];
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  occasion?: string;
}

export interface SearchQuery {
  id?: string;
  userId?: string;
  recipientProfileId?: string;
  queryText: string;
  aiAnalysis?: RecipientAnalysis;
  extractedKeywords?: string[];
  budgetMin?: number;
  budgetMax?: number;
  occasion?: string;
  createdAt?: Date;
}

export interface RecipientAnalysis {
  extractedKeywords: string[];
  suggestedCategories: string[];
  searchQueries: string[];
  personalityTraits: string[];
  giftThemes: string[];
  confidenceScore: number;
}

export interface SearchResults {
  searchId: string;
  products: ProductSearchResult[];
  totalProducts: number;
  sources: string[];
  createdAt: Date;
}

