import { EmptyState } from '@/components/shared/EmptyState';

export default function ListsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gift Lists
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Organize gifts by recipient or occasion
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + New List
        </button>
      </div>

      <EmptyState
        icon="📋"
        title="No gift lists yet"
        description="Create a list to organize gifts for a specific person or occasion."
        action={{
          label: 'Create List',
          onClick: () => console.log('Create list'),
        }}
      />
    </div>
  );
}

