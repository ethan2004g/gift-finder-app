import OpenAI from 'openai';
import { logger } from '../logger';
import { prisma } from '../prisma';
import { RecipientAnalysis } from '@/types/search';
import { cache, generateCacheKey } from '../utils/cache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '1000');

interface AnalyzeRecipientParams {
  relationship?: string;
  ageRange?: string;
  gender?: string;
  interests?: string[];
  likes?: string[];
  dislikes?: string[];
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  occasion?: string;
}

/**
 * Analyze recipient description and generate gift recommendations
 */
export async function analyzeRecipient(
  params: AnalyzeRecipientParams,
  userId?: string
): Promise<RecipientAnalysis> {
  const startTime = Date.now();

  try {
    // Build the prompt
    const prompt = buildAnalysisPrompt(params);

    // Check cache first
    const cacheKey = generateCacheKey('ai-analysis', params);
    const cached = cache.get<RecipientAnalysis>(cacheKey);
    if (cached) {
      logger.info('Using cached AI analysis', { cacheKey, userId });
      return cached;
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an expert gift recommendation assistant. Analyze gift recipient descriptions and provide structured, actionable recommendations for finding the perfect gifts.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the response
    const analysis = parseAnalysisResponse(content);

    // Track API usage
    const tokensUsed = response.usage?.total_tokens || 0;
    const responseTime = Date.now() - startTime;

    if (userId) {
      await trackApiUsage({
        userId,
        service: 'openai',
        endpoint: 'chat/completions',
        tokensUsed,
        responseTime,
      });
    }

    // Cache the result
    cache.set(cacheKey, analysis, 24 * 60 * 60 * 1000); // 24 hours

    logger.info('AI analysis completed', {
      tokensUsed,
      responseTime,
      userId,
    });

    return analysis;
  } catch (error) {
    logger.error('OpenAI API error', { error, userId });
    throw error;
  }
}

/**
 * Build the analysis prompt from recipient data
 */
function buildAnalysisPrompt(params: AnalyzeRecipientParams): string {
  const {
    relationship,
    ageRange,
    gender,
    interests,
    likes,
    dislikes,
    description,
    budgetMin,
    budgetMax,
    occasion,
  } = params;

  let prompt = `Analyze this gift recipient description and provide product recommendations in JSON format:\n\n`;

  if (description) {
    prompt += `Description: ${description}\n`;
  }

  if (relationship) {
    prompt += `Relationship: ${relationship}\n`;
  }

  if (ageRange) {
    prompt += `Age Range: ${ageRange}\n`;
  }

  if (gender) {
    prompt += `Gender: ${gender}\n`;
  }

  if (interests && interests.length > 0) {
    prompt += `Interests/Hobbies: ${interests.join(', ')}\n`;
  }

  if (likes && likes.length > 0) {
    prompt += `Likes: ${likes.join(', ')}\n`;
  }

  if (dislikes && dislikes.length > 0) {
    prompt += `Dislikes: ${dislikes.join(', ')}\n`;
  }

  if (budgetMin || budgetMax) {
    const budget = budgetMin && budgetMax 
      ? `$${budgetMin} - $${budgetMax}`
      : budgetMin 
      ? `$${budgetMin}+`
      : `up to $${budgetMax}`;
    prompt += `Budget: ${budget}\n`;
  }

  if (occasion) {
    prompt += `Occasion: ${occasion}\n`;
  }

  prompt += `\nProvide a JSON response with the following structure:
{
  "extractedKeywords": ["keyword1", "keyword2", ...], // 10-15 relevant keywords for product search
  "suggestedCategories": ["category1", "category2", ...], // 5-8 product categories to explore
  "searchQueries": ["query1", "query2", ...], // 5 specific search queries for ecommerce sites
  "personalityTraits": ["trait1", "trait2", ...], // Personality traits inferred
  "giftThemes": ["theme1", "theme2", ...], // Gift themes that match this person
  "confidenceScore": 0.85 // Confidence score 0-1
}`;

  return prompt;
}

/**
 * Parse the OpenAI response into RecipientAnalysis
 */
function parseAnalysisResponse(content: string): RecipientAnalysis {
  try {
    const parsed = JSON.parse(content);

    return {
      extractedKeywords: parsed.extractedKeywords || [],
      suggestedCategories: parsed.suggestedCategories || [],
      searchQueries: parsed.searchQueries || [],
      personalityTraits: parsed.personalityTraits || [],
      giftThemes: parsed.giftThemes || [],
      confidenceScore: parsed.confidenceScore || 0.5,
    };
  } catch (error) {
    logger.error('Failed to parse OpenAI response', { error, content });
    // Return default structure if parsing fails
    return {
      extractedKeywords: [],
      suggestedCategories: [],
      searchQueries: [],
      personalityTraits: [],
      giftThemes: [],
      confidenceScore: 0.5,
    };
  }
}


/**
 * Track API usage for cost management
 */
async function trackApiUsage(params: {
  userId: string;
  service: string;
  endpoint: string;
  tokensUsed: number;
  responseTime: number;
}): Promise<void> {
  try {
    // Calculate approximate cost (GPT-3.5-turbo pricing)
    const costPer1kTokens = 0.002; // $0.002 per 1k tokens
    const cost = (params.tokensUsed / 1000) * costPer1kTokens;

    await prisma.apiUsage.create({
      data: {
        userId: params.userId,
        service: params.service,
        endpoint: params.endpoint,
        tokensUsed: params.tokensUsed,
        cost,
        responseTime: params.responseTime,
      },
    });
  } catch (error) {
    logger.error('Failed to track API usage', { error });
    // Don't throw - tracking failure shouldn't break the flow
  }
}

