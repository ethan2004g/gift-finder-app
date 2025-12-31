'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';

interface RecipientAnalysis {
  extractedKeywords: string[];
  suggestedCategories: string[];
  searchQueries: string[];
  personalityTraits: string[];
  giftThemes: string[];
  confidenceScore: number;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  imageUrl: string | null;
  productUrl: string;
  source: string;
}

interface SiteBubble {
  site: string;
  products: Product[];
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const searchId = searchParams.get('searchId');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RecipientAnalysis | null>(null);
  const [siteBubbles, setSiteBubbles] = useState<SiteBubble[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProduct = (productId: string) => {
    // Find the product in the bubbles
    for (const bubble of siteBubbles) {
      const product = bubble.products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
        break;
      }
    }
  };

  useEffect(() => {
    if (!searchId) {
      setError('No search ID provided');
      setIsLoading(false);
      return;
    }

    // Fetch search analysis
    const fetchSearch = async () => {
      try {
        const response = await fetch(`/api/search?searchId=${searchId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search');
        }
        const data = await response.json();
        setAnalysis(data.search.aiAnalysis);
        setIsLoading(false);

        // Now search for products using the AI-generated queries
        if (data.search.aiAnalysis?.searchQueries) {
          setIsSearchingProducts(true);
          await searchProducts(data.search.aiAnalysis.searchQueries);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchSearch();
  }, [searchId]);

  const searchProducts = async (queries: string[]) => {
    try {
      const response = await fetch('/api/products/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queries: queries.slice(0, 5), // Use first 5 queries
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to search products');
      }

      const data = await response.json();
      
      // Convert the results object to an array of site bubbles
      const bubbles: SiteBubble[] = Object.entries(data.results).map(([site, products]) => ({
        site,
        products: products as Product[],
      }));

      setSiteBubbles(bubbles);
    } catch (err: any) {
      console.error('Product search error:', err);
      // Don't set error state - just show empty results
    } finally {
      setIsSearchingProducts(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg">
        <h3 className="font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <Link href="/search" className="mt-4 inline-block text-sm underline">
          Back to Search
        </Link>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-6 py-4 rounded-lg">
        <p>No analysis found for this search.</p>
        <Link href="/search" className="mt-4 inline-block text-sm underline">
          Start a New Search
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analysis Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🎯 Gift Recommendations Ready!
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Keywords */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.extractedKeywords.slice(0, 8).map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestedCategories.slice(0, 5).map((category, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Gift Themes */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Gift Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.giftThemes.slice(0, 5).map((theme, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Confidence:</span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-xs">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${analysis.confidenceScore * 100}%` }}
            />
          </div>
          <span>{Math.round(analysis.confidenceScore * 100)}%</span>
        </div>
      </div>

      {/* Product Results by Site (Bubble Layout) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🎁 Product Suggestions
        </h2>

        {isSearchingProducts && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Searching for the perfect gifts...
              </p>
            </div>
          </div>
        )}

        {!isSearchingProducts && siteBubbles.length === 0 && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-6 py-4 rounded-lg">
            <p>No products found yet. Our product search is still in development.</p>
            <p className="text-sm mt-2">
              Try setting up Amazon PA-API or RapidAPI keys in your environment variables.
            </p>
          </div>
        )}

        {/* Site Bubbles */}
        <div className="space-y-8">
          {siteBubbles.map((bubble) => (
            <div
              key={bubble.site}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800"
            >
              {/* Site Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                      {bubble.site}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bubble.products.length} products found
                    </p>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400 text-sm font-semibold">
                  View All →
                </button>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {bubble.products.slice(0, 8).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onView={handleViewProduct}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center mt-8">
        <Link
          href="/search"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          New Search
        </Link>
        <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
          Save Results
        </button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </div>
  );
}

