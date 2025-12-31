import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// GET /api/tags/[tagId] - Get a specific tag
export async function GET(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.tagId },
      include: {
        productTags: {
          take: 20,
          include: {
            product: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                price: true,
                productUrl: true,
              },
            },
          },
        },
      },
    });

    if (!tag) {
      throw new ApiError(404, 'Tag not found');
    }

    return NextResponse.json({ tag });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/tags/[tagId] - Update a tag
export async function PATCH(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.tagId },
    });

    if (!tag) {
      throw new ApiError(404, 'Tag not found');
    }

    // Don't allow editing system tags
    if (tag.isSystemTag) {
      throw new ApiError(403, 'Cannot edit system tags');
    }

    const body = await request.json();
    const { name, category } = body;

    const updatedTag = await prisma.tag.update({
      where: { id: params.tagId },
      data: {
        ...(name && { name: name.toLowerCase().trim() }),
        ...(category !== undefined && { category }),
      },
    });

    logger.info('Tag updated', {
      tagId: updatedTag.id,
      userId: session.user.id,
    });

    return NextResponse.json({ tag: updatedTag });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/tags/[tagId] - Delete a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.tagId },
    });

    if (!tag) {
      throw new ApiError(404, 'Tag not found');
    }

    // Don't allow deleting system tags
    if (tag.isSystemTag) {
      throw new ApiError(403, 'Cannot delete system tags');
    }

    await prisma.tag.delete({
      where: { id: params.tagId },
    });

    logger.info('Tag deleted', {
      tagId: params.tagId,
      userId: session.user.id,
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

