import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// PUT update product subject
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, isBundle, sortOrder, isActive } = body;

    // Check if subject exists
    const existingSubject = await prisma.productSubject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      return NextResponse.json({ error: 'Product subject not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (isBundle !== undefined) updateData.isBundle = Boolean(isBundle);
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const subject = await prisma.productSubject.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error updating product subject:', error);
    return NextResponse.json(
      { error: 'Failed to update product subject' },
      { status: 500 }
    );
  }
}

// DELETE product subject
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if subject exists
    const existingSubject = await prisma.productSubject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      return NextResponse.json({ error: 'Product subject not found' }, { status: 404 });
    }

    await prisma.productSubject.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting product subject:', error);
    return NextResponse.json(
      { error: 'Failed to delete product subject' },
      { status: 500 }
    );
  }
}
