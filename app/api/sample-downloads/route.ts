import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getAccessibleUrl } from '@/lib/Cloudinary';

// Validation schema
const sampleDownloadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  productId: z.string().min(1, 'Product ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Sample download request body:', body);
    
    // Validate request body
    const validatedData = sampleDownloadSchema.parse(body);
    console.log('Validated data:', validatedData);
    
    // Get user IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    console.log('Looking for sample files for productId:', validatedData.productId);

    // Find an active sample file for this product
    const sampleFile = await prisma.sampleFile.findFirst({
      where: {
        postId: validatedData.productId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Found sample file:', sampleFile);

    if (!sampleFile) {
      console.log('No sample file found for product:', validatedData.productId);
      return NextResponse.json(
        { error: 'No sample file available for this product' },
        { status: 404 }
      );
    }

    // Record the download request
    const downloadRecord = await prisma.sampleDownload.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        postId: validatedData.productId,
        sampleFileId: sampleFile.id,
        ipAddress,
        userAgent,
      },
    });

    // Resolve correct Cloudinary resource type. Some legacy sample files were uploaded as image.
    const isImageSample = sampleFile.fileType?.startsWith('image/') ||
      sampleFile.fileUrl?.includes('/image/upload/') ||
      sampleFile.publicId?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

    const resourceType = isImageSample ? 'image' : 'raw';

    // Return a delivery URL that can be downloaded directly
    const downloadUrl = getAccessibleUrl(sampleFile.fileUrl, sampleFile.publicId, resourceType);
    
    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName: sampleFile.fileName,
      downloadId: downloadRecord.id,
    });

  } catch (error) {
    console.error('Sample download error:', error);
    
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

// GET endpoint to retrieve sample downloads (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    const downloads = await prisma.sampleDownload.findMany({
      where: productId ? { postId: productId } : {},
      include: {
        post: {
          select: {
            title: true,
          },
        },
        sampleFile: {
          select: {
            fileName: true,
            fileType: true,
          },
        },
      },
      orderBy: {
        downloadedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      downloads,
    });

  } catch (error) {
    console.error('Error fetching sample downloads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
