import { NextRequest, NextResponse } from 'next/server';
import { getAccessibleUrl } from '@/lib/Cloudinary';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileUrl, fileName } = body;

    if (!fileUrl || !fileName) {
      return NextResponse.json(
        { error: 'Missing fileUrl or fileName' },
        { status: 400 }
      );
    }

    // Determine resource type
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    let resourceType = 'raw';
    
    if (imageTypes.includes(fileExtension)) {
      resourceType = 'image';
    } else if (videoTypes.includes(fileExtension)) {
      resourceType = 'video';
    }
    
    // Extract publicId from fileUrl - handle different Cloudinary URL formats
    let publicId = '';
    if (fileUrl.includes('/Elevate-mortal/')) {
      // Extract from /Elevate-mortal/filename format
      const urlParts = fileUrl.split('/Elevate-mortal/');
      if (urlParts.length > 1) {
        publicId = 'Elevate-mortal/' + urlParts[1].split('?')[0]; // Remove query params if any
      }
    } else {
      // Fallback: extract last two parts
      const urlParts = fileUrl.split('/');
      publicId = urlParts.slice(-2).join('/');
    }
    
    // Generate accessible URL
    const accessibleUrl = getAccessibleUrl(fileUrl, publicId, resourceType);

    return NextResponse.json({ accessibleUrl });
  } catch (error) {
    console.error('Error generating accessible URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate accessible URL' },
      { status: 500 }
    );
  }
}
