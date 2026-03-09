import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for creating sample files
const sampleFileSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Invalid file URL'),
  publicId: z.string().min(1, 'Public ID is required'),
  fileSize: z.number().min(0, 'File size must be positive'),
  fileType: z.string().min(1, 'File type is required'),
  postId: z.string().min(1, 'Product ID is required'),
});

// GET - Retrieve sample files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const isActive = searchParams.get('isActive');
    
    const whereClause: Record<string, unknown> = {};
    if (productId) whereClause.postId = productId;
    if (isActive !== null) whereClause.isActive = isActive === 'true';
    
    const sampleFiles = await prisma.sampleFile.findMany({
      where: whereClause,
      include: {
        post: {
          select: {
            title: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      sampleFiles,
    });

  } catch (error) {
    console.error('Error fetching sample files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new sample file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = sampleFileSchema.parse(body);

    // Check if product exists
    const product = await prisma.post.findUnique({
      where: { id: validatedData.postId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create sample file
    const sampleFile = await prisma.sampleFile.create({
      data: validatedData,
      include: {
        post: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      sampleFile,
    });

  } catch (error) {
    console.error('Error creating sample file:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
