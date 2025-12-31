'use client';

import { Product } from '@/types/product';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onSave?: (productId: string) => void;
  onView?: (productId: string) => void;
}

export function ProductCard({ product, onSave, onView }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = async () => {
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(product.id);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(product.id);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-6xl">🎁</div>
          </div>
        )}
        {product.source && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full capitalize">
            {product.source}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
          {product.title}
        </h3>
        
        {product.price !== null && product.price !== undefined && (
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price.toString()).toFixed(2)}
          </p>
        )}

        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {typeof product.rating === 'number' ? product.rating.toFixed(1) : parseFloat(product.rating.toString()).toFixed(1)}
              {product.reviewCount && ` (${product.reviewCount} reviews)`}
            </span>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            View →
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className={`px-4 py-2 border ${
              isSaved 
                ? 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-700' 
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
            title={isSaved ? "Saved" : "Save product"}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
}

