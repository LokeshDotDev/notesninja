import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all subjects for a product (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subjects = await prisma.productSubject.findMany({
      where: {
        postId: id,
        isActive: true,
      },
      orderBy: [
        { isBundle: 'desc' }, // Bundles first
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        subjectId: true,
        name: true,
        description: true,
        price: true,
        isBundle: true,
        sortOrder: true,
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching product subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product subjects' },
      { status: 500 }
    );
  }
}
