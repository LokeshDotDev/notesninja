import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET all product subjects for a product
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const subjects = await prisma.productSubject.findMany({
      where: {
        postId: productId,
      },
      orderBy: [
        { isBundle: 'desc' }, // Bundles first
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
    });

    return NextResponse.json(subjects, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching product subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product subjects' },
      { status: 500 }
    );
  }
}

// POST create new product subject
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, subjectId, name, description, price, isBundle, sortOrder } = body;

    // Validate required fields
    if (!postId || !subjectId || !name || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, subjectId, name, price' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if subject already exists for this product
    const existingSubject = await prisma.productSubject.findUnique({
      where: {
        postId_subjectId: {
          postId,
          subjectId,
        },
      },
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: 'Subject with this ID already exists for this product' },
        { status: 409 }
      );
    }

    const subject = await prisma.productSubject.create({
      data: {
        postId,
        subjectId,
        name,
        description: description || null,
        price: parseFloat(price),
        isBundle: Boolean(isBundle),
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error('Error creating product subject:', error);
    return NextResponse.json(
      { error: 'Failed to create product subject' },
      { status: 500 }
    );
  }
}
