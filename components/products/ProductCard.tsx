import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onSave?: (productId: string) => void;
  onView?: (productId: string) => void;
}

export function ProductCard({ product, onSave, onView }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        {product.price && (
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            ${product.price.toFixed(2)}
          </p>
        )}

        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.rating.toFixed(1)}
              {product.reviewCount && ` (${product.reviewCount} reviews)`}
            </span>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            View Product
          </a>
          {onSave && (
            <button
              onClick={() => onSave(product.id)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              title="Save product"
            >
              ❤️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

