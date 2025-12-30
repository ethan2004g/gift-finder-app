export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            🎁 Gift Finder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Discover the perfect gift for everyone
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            AI-powered gift recommendations from multiple stores
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-12 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="text-3xl mb-2">1️⃣</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Describe the recipient
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tell us about the person you're shopping for
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">2️⃣</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  AI finds ideas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our AI analyzes and suggests perfect gifts
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">3️⃣</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Browse & save
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View products from multiple stores in one place
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <a
              href="/search"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 shadow-md transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>

        <div className="mt-16 text-sm text-gray-500 dark:text-gray-400">
          <p>🚀 Next.js App Router • TypeScript • Tailwind CSS • shadcn/ui</p>
        </div>
      </main>
    </div>
  );
}
