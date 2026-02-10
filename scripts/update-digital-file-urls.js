const { PrismaClient } = require('@prisma/client');
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate signed URL for secure access
function generateSignedUrl(publicId, resourceType = 'image') {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { public_id: publicId, timestamp: timestamp, type: 'upload' },
    process.env.CLOUDINARY_API_SECRET || ''
  );

  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
  return `${baseUrl}/s--${signature}--/${publicId}`;
}

// Get accessible URL (signed for raw files, regular for images)
function getAccessibleUrl(secureUrl, publicId, resourceType = 'image') {
  // For raw files, generate signed URL
  if (resourceType === 'raw') {
    return generateSignedUrl(publicId, resourceType);
  }
  // For images and videos, use secure_url directly
  return secureUrl;
}

const prisma = new PrismaClient();

async function updateDigitalFileUrls() {
  try {
    console.log('Starting to update digital file URLs...');
    
    // Get all digital files
    const digitalFiles = await prisma.digitalFile.findMany();
    console.log(`Found ${digitalFiles.length} digital files to update`);
    
    for (const file of digitalFiles) {
      try {
        // Determine resource type
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
        const fileExtension = file.fileType.toLowerCase();
        let resourceType = 'raw';
        
        if (imageTypes.includes(fileExtension)) {
          resourceType = 'image';
        } else if (videoTypes.includes(fileExtension)) {
          resourceType = 'video';
        }
        
        // Generate accessible URL
        const accessibleUrl = getAccessibleUrl(file.fileUrl, file.publicId, resourceType);
        
        // Update the file record
        await prisma.digitalFile.update({
          where: { id: file.id },
          data: { fileUrl: accessibleUrl }
        });
        
        console.log(`Updated: ${file.fileName} -> ${accessibleUrl.substring(0, 100)}...`);
      } catch (error) {
        console.error(`Failed to update ${file.fileName}:`, error);
      }
    }
    
    console.log('Digital file URL update completed!');
  } catch (error) {
    console.error('Error updating digital file URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDigitalFileUrls();
