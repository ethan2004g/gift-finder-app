'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    relationship: '',
    ageRange: '',
    gender: '',
    interests: '',
    likes: '',
    dislikes: '',
    budgetMin: '',
    budgetMax: '',
    occasion: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create search with AI analysis
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
          likes: formData.likes.split(',').map(i => i.trim()).filter(Boolean),
          dislikes: formData.dislikes.split(',').map(i => i.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create search');
      }

      const data = await response.json();
      
      // Redirect to results page with search ID
      router.push(`/results?searchId=${data.search.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      relationship: '',
      ageRange: '',
      gender: '',
      interests: '',
      likes: '',
      dislikes: '',
      budgetMin: '',
      budgetMax: '',
      occasion: '',
      description: '',
    });
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Describe the recipient *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Tell us about the person you're shopping for... What do they like? What makes them unique?"
          required
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Be specific! The more details, the better our AI can help.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Relationship
          </label>
          <select
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isLoading}
          >
            <option value="">Select...</option>
            <option value="friend">Friend</option>
            <option value="partner">Partner/Spouse</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="child">Child</option>
            <option value="colleague">Colleague</option>
            <option value="relative">Other Relative</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Age Range
          </label>
          <select
            id="ageRange"
            name="ageRange"
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isLoading}
          >
            <option value="">Select...</option>
            <option value="0-12">Child (0-12)</option>
            <option value="13-17">Teen (13-17)</option>
            <option value="18-25">Young Adult (18-25)</option>
            <option value="26-35">Adult (26-35)</option>
            <option value="36-50">Middle Age (36-50)</option>
            <option value="51-65">Senior (51-65)</option>
            <option value="65+">Elderly (65+)</option>
          </select>
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gender (Optional)
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isLoading}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Occasion
        </label>
        <select
          id="occasion"
          name="occasion"
          value={formData.occasion}
          onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={isLoading}
        >
          <option value="">Select occasion...</option>
          <option value="birthday">Birthday</option>
          <option value="christmas">Christmas</option>
          <option value="anniversary">Anniversary</option>
          <option value="wedding">Wedding</option>
          <option value="graduation">Graduation</option>
          <option value="valentines">Valentine's Day</option>
          <option value="mothers-day">Mother's Day</option>
          <option value="fathers-day">Father's Day</option>
          <option value="thank-you">Thank You</option>
          <option value="just-because">Just Because</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget Min ($)
          </label>
          <input
            type="number"
            id="budgetMin"
            name="budgetMin"
            value={formData.budgetMin}
            onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0"
            min="0"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget Max ($)
          </label>
          <input
            type="number"
            id="budgetMax"
            name="budgetMax"
            value={formData.budgetMax}
            onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="1000"
            min="0"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Interests & Hobbies
        </label>
        <input
          type="text"
          id="interests"
          name="interests"
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="e.g., photography, cooking, gaming, hiking"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Separate multiple interests with commas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="likes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Things They Like
          </label>
          <input
            type="text"
            id="likes"
            name="likes"
            value={formData.likes}
            onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="e.g., coffee, books, travel"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="dislikes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Things to Avoid
          </label>
          <input
            type="text"
            id="dislikes"
            name="dislikes"
            value={formData.dislikes}
            onChange={(e) => setFormData({ ...formData, dislikes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="e.g., chocolate, loud colors"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding Gift Ideas...
            </>
          ) : (
            '🎁 Find Gift Ideas'
          )}
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
}

