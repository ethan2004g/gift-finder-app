import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Start finding the perfect gifts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/search"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            New Search
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find gift ideas for someone special
          </p>
        </Link>

        <Link
          href="/saved"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">❤️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Saved Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View your saved gift ideas
          </p>
        </Link>

        <Link
          href="/lists"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Gift Lists
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Organize gifts by recipient
          </p>
        </Link>

        <Link
          href="/recipients"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Recipients
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage recipient profiles
          </p>
        </Link>

        <Link
          href="/tags"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🏷️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Tags
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse gifts by category
          </p>
        </Link>

        <Link
          href="/sites"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🛍️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Custom Sites
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Add your favorite stores
          </p>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No recent searches yet. Start by creating a new search!
        </p>
      </div>
    </div>
  );
}

