import { EmptyState } from '@/components/shared/EmptyState';

export default function RecipientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recipients
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage profiles of people you shop for
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Add Recipient
        </button>
      </div>

      <EmptyState
        icon="👥"
        title="No recipients yet"
        description="Create recipient profiles to save their preferences and make future searches easier."
        action={{
          label: 'Add Recipient',
          onClick: () => console.log('Add recipient'),
        }}
      />
    </div>
  );
}

