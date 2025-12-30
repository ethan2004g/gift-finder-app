import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = source ? { source } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

