'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Prevent scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Call API to save product
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <div className="relative w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-9xl">🎁</div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Source:
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm capitalize">
                    {product.source}
                  </span>
                </div>
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Rating:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.rating.toFixed(1)}
                        {product.reviewCount && ` (${product.reviewCount} reviews)`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h3>

              {product.price && (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.currency && product.currency !== 'USD' && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.currency}
                    </span>
                  )}
                </div>
              )}

              {product.description && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Description
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  View on {product.source}
                </a>
                <button
                  onClick={handleSave}
                  className={`block w-full ${
                    isSaved
                      ? 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-700 text-red-700 dark:text-red-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  } border-2 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-600`}
                >
                  {isSaved ? '❤️ Saved to List' : '🤍 Save to List'}
                </button>
              </div>

              {/* Additional Features */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>🔗</span>
                  <span>Affiliate link - We may earn a commission</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>🛡️</span>
                  <span>Prices may vary - Click to see current price</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

