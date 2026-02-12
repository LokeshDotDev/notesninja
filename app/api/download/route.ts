import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface DownloadRequest {
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
  purchaseId?: string;
  userEmail?: string;
}

/**
 * Secure download endpoint that streams files from Cloudinary server-side
 * This prevents direct exposure of Cloudinary URLs and ensures proper download behavior
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const fileUrl = searchParams.get('fileUrl');
    const fileName = searchParams.get('fileName');
    const purchaseId = searchParams.get('purchaseId');
    const userEmail = searchParams.get('userEmail');

    console.log('Download request:', { fileId, fileUrl, fileName, purchaseId, userEmail });

    // Validate required parameters
    if (!fileId && !fileUrl) {
      return NextResponse.json(
        { error: 'Missing fileId or fileUrl parameter' },
        { status: 400 }
      );
    }

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing fileName parameter' },
        { status: 400 }
      );
    }

    let fileData: {
      fileUrl: string;
      publicId: string;
      fileName: string;
      fileSize: number;
      fileType: string;
    } | null = null;

    // Option 1: Download by fileId (requires purchase verification)
    if (fileId) {
      if (!purchaseId || !userEmail) {
        return NextResponse.json(
          { error: 'Purchase verification required for fileId downloads' },
          { status: 400 }
        );
      }

      // Verify purchase exists and belongs to user
      const purchase = await prisma.purchase.findFirst({
        where: {
          id: purchaseId,
          userEmail,
          status: 'completed'
        },
        include: {
          post: {
            include: {
              digitalFiles: true
            }
          }
        }
      });

      if (!purchase) {
        return NextResponse.json(
          { error: 'Purchase not found or not completed' },
          { status: 404 }
        );
      }

      // Find the specific file in the purchase
      const file = purchase.post.digitalFiles.find(f => f.id === fileId);
      if (!file) {
        return NextResponse.json(
          { error: 'File not found in purchase' },
          { status: 404 }
        );
      }

      fileData = {
        fileUrl: file.fileUrl,
        publicId: file.publicId,
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileType: file.fileType
      };

      // Increment download count
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: { downloadCount: { increment: 1 } }
      });

    } 
    // Option 2: Download by fileUrl + fileName (for email links, no purchase verification needed)
    else if (fileUrl) {
      console.log('Processing fileUrl download:', { fileUrl, fileName });
      
      // Extract publicId from fileUrl
      let publicId = '';
      
      // Try different patterns to extract publicId
      if (fileUrl.includes('/Elevate-mortal/')) {
        const urlParts = fileUrl.split('/Elevate-mortal/');
        if (urlParts.length > 1) {
          publicId = 'Elevate-mortal/' + urlParts[1].split('?')[0];
        }
      } else if (fileUrl.includes('/upload/')) {
        // Extract from standard Cloudinary URL pattern
        const uploadIndex = fileUrl.indexOf('/upload/') + 8;
        const afterUpload = fileUrl.substring(uploadIndex);
        // Remove version if present (v1234567890/)
        const withoutVersion = afterUpload.replace(/^v\d+\//, '');
        publicId = withoutVersion.split('?')[0];
      } else {
        // Fallback: extract last two parts
        const urlParts = fileUrl.split('/').filter(part => part.length > 0);
        publicId = urlParts.slice(-2).join('/');
      }
      
      console.log('Extracted publicId:', { publicId, originalUrl: fileUrl });

      fileData = {
        fileUrl,
        publicId,
        fileName,
        fileSize: 0, // Will be determined from Cloudinary
        fileType: fileName.split('.').pop()?.toLowerCase() || 'unknown'
      };
    }

    if (!fileData) {
      return NextResponse.json(
        { error: 'Unable to locate file data' },
        { status: 404 }
      );
    }

    // Determine resource type
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    const fileExtension = fileData.fileName.split('.').pop()?.toLowerCase() || '';
    
    let resourceType: 'raw' | 'image' | 'video' = 'raw';
    if (imageTypes.includes(fileExtension)) {
      resourceType = 'image';
    } else if (videoTypes.includes(fileExtension)) {
      resourceType = 'video';
    }

    console.log('Fetching file from Cloudinary:', { 
      publicId: fileData.publicId, 
      resourceType, 
      fileName: fileData.fileName 
    });

    // Fetch file from Cloudinary using Admin SDK for raw files
    try {
      console.log('Using Cloudinary Admin SDK to fetch raw file:', { 
        publicId: fileData.publicId, 
        resourceType 
      });

      // For raw files, use private download URL for authenticated access
      if (resourceType === 'raw') {
        // Generate a private download URL that includes authentication
        const privateDownloadUrl = cloudinary.utils.private_download_url(
          fileData.publicId,
          fileData.fileName,
          {
            resource_type: 'raw',
            type: 'upload',
            expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
            attachment: true // Force download
          }
        );

        console.log('Generated private download URL for raw file:', {
          publicId: fileData.publicId,
          urlLength: privateDownloadUrl.length,
          hasSignature: privateDownloadUrl.includes('signature'),
          urlPreview: privateDownloadUrl.substring(0, 100) + '...'
        });

        if (!privateDownloadUrl) {
          throw new Error(`Failed to generate private download URL for raw file: ${fileData.publicId}`);
        }

        // Redirect to the private download URL instead of fetching and streaming
        // This is much faster as Cloudinary handles the streaming
        return NextResponse.redirect(privateDownloadUrl, 301);

      } else {
        // For images/videos, use signed URL approach
        const signedUrl = cloudinary.utils.url(fileData.publicId, {
          resource_type: resourceType,
          type: 'upload',
          secure: true,
          sign_url: true,
          expire_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
          format: fileData.fileName.split('.').pop() // Preserve original format
        });

        console.log('Redirecting to signed URL for non-raw file:', signedUrl.substring(0, 100) + '...');

        // Redirect to the signed URL for faster streaming
        return NextResponse.redirect(signedUrl, 301);
      }

    } catch (fetchError) {
      console.error('Failed to generate Cloudinary URL:', fetchError);
      
      // Final fallback: try direct URL fetch (will likely fail for raw files but worth trying)
      try {
        console.log('Attempting fallback direct fetch...');
        const response = await fetch(fileData.fileUrl);
        if (!response.ok) {
          throw new Error(`Fallback fetch failed: ${response.status} ${response.statusText}`);
        }

        const fileBuffer = Buffer.from(await response.arrayBuffer());
        console.log('Fallback fetch succeeded, streaming file');
        
        // Set appropriate headers for download
        const headers = new Headers({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(fileData.fileName)}"`,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });

        // Return the file as a streaming response
        return new NextResponse(new Uint8Array(fileBuffer), {
          status: 200,
          headers
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error(`Unable to fetch file from Cloudinary: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }
    }

  } catch (error) {
    console.error('Download error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to download file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for download validation (optional enhancement)
 * Could be used to validate download permissions before serving the file
 */
export async function POST(request: NextRequest) {
  try {
    const body: DownloadRequest = await request.json();
    const { fileId, purchaseId, userEmail } = body;

    if (!fileId || !purchaseId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify purchase exists and belongs to user
    const purchase = await prisma.purchase.findFirst({
      where: {
        id: purchaseId,
        userEmail,
        status: 'completed'
      },
      include: {
        post: {
          include: {
            digitalFiles: true
          }
        }
      }
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found or not completed' },
        { status: 404 }
      );
    }

    // Find the specific file in the purchase
    const file = purchase.post.digitalFiles.find(f => f.id === fileId);
    if (!file) {
      return NextResponse.json(
        { error: 'File not found in purchase' },
        { status: 404 }
      );
    }

    // Generate secure download URL
    const downloadUrl = `/api/download?fileId=${fileId}&fileName=${encodeURIComponent(file.fileName)}&purchaseId=${purchaseId}&userEmail=${encodeURIComponent(userEmail)}`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName: file.fileName,
      fileSize: file.fileSize,
      fileType: file.fileType
    });

  } catch (error) {
    console.error('Download validation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to validate download',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
