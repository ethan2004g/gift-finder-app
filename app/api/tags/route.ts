import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// GET /api/tags - List all tags
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const tags = await prisma.tag.findMany({
      where,
      orderBy: [
        { usageCount: 'desc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        category: true,
        isSystemTag: true,
        usageCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const body = await request.json();
    const { name, category } = body;

    if (!name || typeof name !== 'string') {
      throw new ApiError(400, 'Tag name is required');
    }

    // Check if tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: name.toLowerCase().trim() },
    });

    if (existingTag) {
      return NextResponse.json({ tag: existingTag });
    }

    // Create new tag
    const tag = await prisma.tag.create({
      data: {
        name: name.toLowerCase().trim(),
        category: category || null,
        isSystemTag: false,
      },
    });

    logger.info('Tag created', {
      tagId: tag.id,
      name: tag.name,
      userId: session.user.id,
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

