import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          🎁 Gift Finder
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
          >
            Search
          </Link>
          <Link
            href="/saved"
            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
          >
            Saved
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <button className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            Profile
          </button>
        </nav>
      </div>
    </header>
  );
}

