import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { analyzeRecipient } from '@/lib/api/openai';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new ApiError(500, 'OpenAI API key not configured');
    }

    const body = await request.json();
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
    } = body;

    if (!description && !interests?.length) {
      throw new ApiError(400, 'Description or interests are required');
    }

    // Analyze recipient using OpenAI
    const analysis = await analyzeRecipient(
      {
        relationship,
        ageRange,
        gender,
        interests: Array.isArray(interests) ? interests : [],
        likes: Array.isArray(likes) ? likes : [],
        dislikes: Array.isArray(dislikes) ? dislikes : [],
        description,
        budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
        budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
        occasion,
      },
      session.user.id
    );

    logger.info('AI analysis completed', {
      userId: session.user.id,
      keywordsCount: analysis.extractedKeywords.length,
      queriesCount: analysis.searchQueries.length,
    });

    return NextResponse.json({
      analysis,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

