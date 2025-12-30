import { NextResponse } from 'next/server';
import { logger } from '../logger';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  logger.error('API Error', { error });

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Don't expose internal errors in production
    const message =
      process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred'
        : error.message;

    return NextResponse.json(
      {
        error: message,
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}

export function validateRequest(
  body: any,
  schema: { parse: (data: any) => any }
): { success: boolean; data?: any; error?: string } {
  try {
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.errors?.[0]?.message || 'Validation failed',
    };
  }
}

