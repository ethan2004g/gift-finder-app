export default function TagsPage() {
  const popularTags = [
    'Tech', 'Fashion', 'Books', 'Sports', 'Gaming',
    'Music', 'Art', 'Cooking', 'Outdoor', 'Beauty',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Browse by Tags
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Discover gifts by category
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Popular Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

