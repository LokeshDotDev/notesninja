/**
 * Cloudinary Image Optimization Utilities
 * 
 * Simple transformation parameter addition without custom loaders.
 * This ensures Next.js Image optimization still works properly.
 */

/**
 * Adds Cloudinary transformation parameters to an image URL
 * 
 * @param url - The Cloudinary URL or public_id
 * @returns URL with optimization parameters (f_auto, q_auto)
 * 
 * @example
 * addCloudinaryParams('https://res.cloudinary.com/demo/image/upload/sample.jpg')
 * // Returns: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample.jpg'
 */
export function addCloudinaryParams(url: string | null | undefined): string {
  if (!url) return '';
  
  // Only process Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;
  
  // Check if parameters already exist
  if (url.includes('f_auto')) return url;
  
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;
    
    const beforeUpload = url.substring(0, uploadIndex + 8); // Include '/upload/'
    const afterUpload = url.substring(uploadIndex + 8);
    
    const pathParts = afterUpload.split('/');
    
    // Check if first part is already transformations (has commas) or version
    let assetStartIndex = 0;
    if (pathParts[0] && (pathParts[0].includes(',') || pathParts[0].match(/^v\d{10}$/))) {
      assetStartIndex = 1;
    }
    
    const cleanPath = pathParts.slice(assetStartIndex).join('/');
    const params = 'f_auto,q_auto';
    
    return `${beforeUpload}${params}/${cleanPath}`;
  } catch (e) {
    console.error('Error adding Cloudinary params:', e);
    return url;
  }
}

/**
 * Extracts the public_id from a Cloudinary URL
 */
export function extractCloudinaryPublicId(url: string | null | undefined): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    
    const assetPath = url.substring(uploadIndex + 8);
    const pathParts = assetPath.split('/');
    
    const cleanParts: string[] = [];
    for (const part of pathParts) {
      if (part.includes(',') || part.match(/^v\d{10}$/)) {
        continue;
      }
      cleanParts.push(part);
    }
    
    const publicIdWithExt = cleanParts.join('/');
    const lastDot = publicIdWithExt.lastIndexOf('.');
    
    return lastDot > 0 ? publicIdWithExt.substring(0, lastDot) : publicIdWithExt;
  } catch (e) {
    console.error('Error extracting public_id:', e);
    return null;
  }
}

/**
 * Generates a thumbnail URL
 */
export function getCloudinaryThumbnail(url: string | null | undefined, size: number = 200): string {
  if (!url) return '';
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dtan6xot2';
  
  if (url.includes('res.cloudinary.com')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const beforeUpload = url.substring(0, uploadIndex + 8);
      const afterUpload = url.substring(uploadIndex + 8);
      const pathParts = afterUpload.split('/');
      
      let assetStartIndex = 0;
      if (pathParts[0] && (pathParts[0].includes(',') || pathParts[0].match(/^v\d{10}$/))) {
        assetStartIndex = 1;
      }
      
      const cleanPath = pathParts.slice(assetStartIndex).join('/');
      return `${beforeUpload}f_auto,q_auto,w_${size},c_fill/${cleanPath}`;
    }
  }
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${size},c_fill/${url}`;
}

/**
 * Get responsive URLs for different sizes
 */
export function getResponsiveCloudinaryUrls(
  url: string | null | undefined,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
): Record<number, string> {
  const urls: Record<number, string> = {};
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dtan6xot2';
  
  if (!url) return urls;
  
  sizes.forEach(size => {
    if (url.includes('res.cloudinary.com')) {
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex !== -1) {
        const beforeUpload = url.substring(0, uploadIndex + 8);
        const afterUpload = url.substring(uploadIndex + 8);
        const pathParts = afterUpload.split('/');
        
        let assetStartIndex = 0;
        if (pathParts[0] && (pathParts[0].includes(',') || pathParts[0].match(/^v\d{10}$/))) {
          assetStartIndex = 1;
        }
        
        const cleanPath = pathParts.slice(assetStartIndex).join('/');
        urls[size] = `${beforeUpload}f_auto,q_auto,w_${size},c_limit/${cleanPath}`;
        return;
      }
    }
    
    urls[size] = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${size},c_limit/${url}`;
  });
  
  return urls;
}
