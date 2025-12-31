import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { analyzeRecipient } from '@/lib/api/openai';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const body = await request.json();
    const {
      queryText,
      recipientProfileId,
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

    if (!queryText && !description && !interests?.length) {
      throw new ApiError(400, 'Query text, description, or interests are required');
    }

    // Perform AI analysis if OpenAI is configured
    let aiAnalysis = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        aiAnalysis = await analyzeRecipient(
          {
            relationship,
            ageRange,
            gender,
            interests: Array.isArray(interests) ? interests : [],
            likes: Array.isArray(likes) ? likes : [],
            dislikes: Array.isArray(dislikes) ? dislikes : [],
            description: description || queryText,
            budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
            budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
            occasion,
          },
          session.user.id
        );
      } catch (error) {
        logger.warn('AI analysis failed, continuing without it', { error });
        // Continue without AI analysis if it fails
      }
    }

    // Create search record with AI analysis
    const search = await prisma.search.create({
      data: {
        userId: session.user.id,
        queryText: queryText || description || 'AI-generated search',
        recipientProfileId: recipientProfileId || null,
        aiAnalysis: aiAnalysis ? (aiAnalysis as any) : null,
        extractedKeywords: aiAnalysis?.extractedKeywords || [],
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
        occasion: occasion || null,
      },
    });

    logger.info('Search created', {
      searchId: search.id,
      userId: session.user.id,
      hasAiAnalysis: !!aiAnalysis,
    });

    return NextResponse.json(
      {
        message: 'Search created successfully',
        search: {
          id: search.id,
          queryText: search.queryText,
          aiAnalysis,
          createdAt: search.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get('searchId');

    // If searchId is provided, fetch single search
    if (searchId) {
      const search = await prisma.search.findUnique({
        where: {
          id: searchId,
          userId: session.user.id, // Ensure user owns this search
        },
        select: {
          id: true,
          queryText: true,
          aiAnalysis: true,
          extractedKeywords: true,
          budgetMin: true,
          budgetMax: true,
          occasion: true,
          createdAt: true,
        },
      });

      if (!search) {
        throw new ApiError(404, 'Search not found');
      }

      return NextResponse.json({ search });
    }

    // Otherwise, return list of searches
    const searches = await prisma.search.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      select: {
        id: true,
        queryText: true,
        createdAt: true,
        occasion: true,
      },
    });

    return NextResponse.json({ searches });
  } catch (error) {
    return handleApiError(error);
  }
}

