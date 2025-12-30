import { SearchForm } from '@/components/search/SearchForm';

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Find the Perfect Gift
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tell us about the person you're shopping for, and we'll find amazing gift ideas.
        </p>
      </div>

      <SearchForm />
    </div>
  );
}

