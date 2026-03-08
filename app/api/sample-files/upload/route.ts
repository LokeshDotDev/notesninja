import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadContent } from '@/lib/Cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string || file.name;
    const postId = formData.get('postId') as string;
    const isActive = formData.get('isActive') === 'true';

    if (!file || !postId) {
      return NextResponse.json(
        { error: 'File and product ID are required' },
        { status: 400 }
      );
    }

    // Upload file to Cloudinary (as digital file)
    const uploadResult = await uploadContent(file, true);

    // Save to database with Cloudinary data
    const sampleFile = await prisma.sampleFile.create({
      data: {
        fileName: fileName,
        fileUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileSize: file.size,
        fileType: file.type,
        postId: postId,
        isActive: isActive,
      },
    });

    return NextResponse.json({
      success: true,
      sampleFile,
      message: 'File uploaded successfully',
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
