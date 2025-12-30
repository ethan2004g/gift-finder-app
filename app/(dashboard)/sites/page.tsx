import { EmptyState } from '@/components/shared/EmptyState';

export default function SitesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Custom Ecommerce Sites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Add your favorite stores to search
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Add Site
        </button>
      </div>

      <EmptyState
        icon="🛍️"
        title="No custom sites yet"
        description="Add your favorite ecommerce sites to include them in your searches."
      />
    </div>
  );
}

