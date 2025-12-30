import { EmptyState } from '@/components/shared/EmptyState';

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Saved Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your favorite gift ideas
        </p>
      </div>

      <EmptyState
        icon="❤️"
        title="No saved products yet"
        description="Start searching for gifts and save the ones you like!"
        action={{
          label: 'Start Searching',
          onClick: () => window.location.href = '/search',
        }}
      />
    </div>
  );
}

