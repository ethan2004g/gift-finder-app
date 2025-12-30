import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { productService } from '@/lib/api/product-service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const body = await request.json();
    const { queries, sources, limit, minPrice, maxPrice, category, sortBy } = body;

    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      throw new ApiError(400, 'Queries array is required');
    }

    // Search across all sources
    const results = await productService.searchAll(queries, {
      limit: limit || 10,
      minPrice,
      maxPrice,
      category,
      sortBy,
    }, sources);

    // Convert Map to object for JSON response
    const response: Record<string, any> = {};
    let totalProducts = 0;

    for (const [source, products] of results.entries()) {
      response[source] = products;
      totalProducts += products.length;
    }

    logger.info('Product search completed', {
      userId: session.user.id,
      queries: queries.length,
      sources: results.size,
      totalProducts,
    });

    return NextResponse.json({
      results: response,
      totalProducts,
      sources: Array.from(results.keys()),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

