import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// POST /api/products/[productId]/tags - Assign tags to a product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { productId } = await params;
    const body = await request.json();
    const { tagIds } = body;

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      throw new ApiError(400, 'Tag IDs array is required');
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Create product-tag associations
    const productTags = await Promise.all(
      tagIds.map(async (tagId: string) => {
        // Increment tag usage count
        await prisma.tag.update({
          where: { id: tagId },
          data: { usageCount: { increment: 1 } },
        });

        return prisma.productTag.upsert({
          where: {
            productId_tagId: {
              productId,
              tagId,
            },
          },
          create: {
            productId,
            tagId,
          },
          update: {},
        });
      })
    );

    logger.info('Tags assigned to product', {
      productId,
      tagCount: tagIds.length,
      userId: session.user.id,
    });

    return NextResponse.json({ productTags });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/products/[productId]/tags - Remove tags from a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { productId } = await params;
    const body = await request.json();
    const { tagIds } = body;

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      throw new ApiError(400, 'Tag IDs array is required');
    }

    // Remove product-tag associations
    await prisma.productTag.deleteMany({
      where: {
        productId,
        tagId: { in: tagIds },
      },
    });

    // Decrement tag usage counts
    await Promise.all(
      tagIds.map((tagId: string) =>
        prisma.tag.update({
          where: { id: tagId },
          data: { usageCount: { decrement: 1 } },
        })
      )
    );

    logger.info('Tags removed from product', {
      productId,
      tagCount: tagIds.length,
      userId: session.user.id,
    });

    return NextResponse.json({ message: 'Tags removed successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

