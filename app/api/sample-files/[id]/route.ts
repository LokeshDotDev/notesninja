import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { deleteContent } from '@/lib/Cloudinary';

// Validation schema for updating sample files
const updateSampleFileSchema = z.object({
  fileName: z.string().min(1, 'File name is required').optional(),
  fileUrl: z.string().min(1, 'File URL is required').optional(),
  publicId: z.string().min(1, 'Public ID is required').optional(),
  fileSize: z.number().min(0, 'File size must be positive').optional(),
  fileType: z.string().min(1, 'File type is required').optional(),
  isActive: z.boolean().optional(),
}).refine((data) => {
  // At least one field should be provided for update
  return Object.keys(data).length > 0;
}, {
  message: "At least one field must be provided for update"
});

// GET - Retrieve single sample file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sampleFile = await prisma.sampleFile.findUnique({
      where: { id },
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
    });

    if (!sampleFile) {
      return NextResponse.json(
        { error: 'Sample file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sampleFile,
    });

  } catch (error) {
    console.error('Error fetching sample file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update sample file
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Debug: Log the incoming request body
    console.log('Update request body:', body);
    
    // Validate request body
    const validatedData = updateSampleFileSchema.parse(body);

    // Check if sample file exists
    const existingFile = await prisma.sampleFile.findUnique({
      where: { id },
    });

    if (!existingFile) {
      return NextResponse.json(
        { error: 'Sample file not found' },
        { status: 404 }
      );
    }

    // Update sample file
    const sampleFile = await prisma.sampleFile.update({
      where: { id },
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
    console.error('Error updating sample file:', error);
    
    if (error instanceof z.ZodError) {
      console.log('Zod validation errors:', error.errors);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors,
          receivedBody: 'Check server logs for the actual request body'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete sample file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if sample file exists
    const existingFile = await prisma.sampleFile.findUnique({
      where: { id },
    });

    if (!existingFile) {
      return NextResponse.json(
        { error: 'Sample file not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary first
    try {
      await deleteContent(existingFile.publicId, 'raw');
      console.log(`✅ Deleted file from Cloudinary: ${existingFile.publicId}`);
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete sample file (cascade will delete related downloads)
    await prisma.sampleFile.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Sample file deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting sample file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
