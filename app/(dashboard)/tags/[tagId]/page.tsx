'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ProductCard } from '@/components/products/ProductCard';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  imageUrl: string | null;
  price: number | null;
  productUrl: string;
}

interface Tag {
  id: string;
  name: string;
  category: string | null;
  isSystemTag: boolean;
  usageCount: number;
  productTags: Array<{
    product: Product;
  }>;
}

export default function TagDetailPage() {
  const params = useParams();
  const tagId = params.tagId as string;
  
  const [tag, setTag] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tagId) {
      fetchTag();
    }
  }, [tagId]);

  const fetchTag = async () => {
    try {
      const response = await fetch(`/api/tags/${tagId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tag');
      }
      const data = await response.json();
      setTag(data.tag);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !tag) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg">
        <h3 className="font-semibold mb-2">Error</h3>
        <p>{error || 'Tag not found'}</p>
        <Link href="/tags" className="mt-4 inline-block text-sm underline">
          Back to Tags
        </Link>
      </div>
    );
  }

  const products = tag.productTags.map(pt => pt.product);

  return (
    <div>
      {/* Tag Header */}
      <div className="mb-8">
        <Link
          href="/tags"
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 mb-4 inline-flex items-center gap-2"
        >
          ← Back to Tags
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white capitalize">
            {tag.name}
          </h1>
          {tag.isSystemTag && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-semibold">
              System Tag ⭐
            </span>
          )}
        </div>
        {tag.category && (
          <p className="text-gray-600 dark:text-gray-400 mt-2 capitalize">
            Category: {tag.category}
          </p>
        )}
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {tag.usageCount} {tag.usageCount === 1 ? 'product' : 'products'} tagged
        </p>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-6 py-4 rounded-lg">
          <p>No products tagged with "{tag.name}" yet.</p>
          <Link href="/search" className="mt-4 inline-block text-sm underline">
            Start a Search
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Products ({products.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

