import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all user logs to test the database storage
    const userLogs = await prisma.userLog.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to last 10 records for testing
    });

    return NextResponse.json({
      success: true,
      message: `Found ${userLogs.length} user logs`,
      data: userLogs
    });

  } catch (error) {
    console.error('Error fetching user logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user logs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
