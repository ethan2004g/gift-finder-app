import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check if database is connected
    if (!process.env.DATABASE_URL) {
      logger.error('DATABASE_URL not configured');
      throw new ApiError(500, 'Database configuration error');
    }

    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    if (password.length < 8) {
      throw new ApiError(400, 'Password must be at least 8 characters');
    }

    // Test database connection
    try {
      await prisma.$connect();
    } catch (dbError) {
      logger.error('Database connection failed', { error: dbError });
      throw new ApiError(500, 'Database connection failed');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    logger.info('User created', { userId: user.id, email: user.email });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Signup error', { error });
    return handleApiError(error);
  }
}

