/**
 * Extract keywords from text using simple heuristics
 * This is a fallback when AI analysis is not available
 */

export function extractKeywords(text: string): string[] {
  if (!text) return [];

  // Convert to lowercase and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2);

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'they', 'them', 'their', 'there', 'what', 'which', 'who', 'when', 'where',
    'why', 'how', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
    'further', 'then', 'once', 'here', 'when', 'where', 'why', 'how', 'all',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'don', 'should', 'now',
  ]);

  // Filter out stop words and get unique keywords
  const keywords = Array.from(
    new Set(words.filter((word) => !stopWords.has(word)))
  );

  // Return top 15 keywords
  return keywords.slice(0, 15);
}

/**
 * Generate search queries from keywords and context
 */
export function generateSearchQueries(
  keywords: string[],
  context?: {
    occasion?: string;
    budget?: string;
    category?: string;
  }
): string[] {
  const queries: string[] = [];

  // Use top keywords directly
  if (keywords.length > 0) {
    queries.push(keywords.slice(0, 3).join(' '));
    queries.push(keywords.slice(0, 5).join(' '));
  }

  // Add occasion-specific queries
  if (context?.occasion) {
    queries.push(`${context.occasion} gift ${keywords[0] || ''}`.trim());
  }

  // Add category-specific queries
  if (context?.category) {
    queries.push(`${context.category} ${keywords[0] || ''}`.trim());
  }

  // Add budget-specific queries
  if (context?.budget) {
    queries.push(`${keywords[0] || 'gift'} ${context.budget}`.trim());
  }

  // Ensure we have at least 3 queries
  while (queries.length < 3 && keywords.length > 0) {
    const remaining = keywords.slice(queries.length);
    if (remaining.length > 0) {
      queries.push(remaining.slice(0, 3).join(' '));
    } else {
      break;
    }
  }

  return queries.slice(0, 5); // Return max 5 queries
}

