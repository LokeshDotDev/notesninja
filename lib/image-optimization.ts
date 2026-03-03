/**
 * Image URL Optimization Middleware
 * Automatically adds Cloudinary optimization parameters to all image URLs
 */

/**
 * Optimizes image URL by adding Cloudinary transformation parameters
 * @param url - Image URL
 * @returns Optimized URL with f_auto,q_auto parameters
 */
export function optimizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // Only optimize Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  // Check if already optimized
  if (url.includes('f_auto')) return url;

  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const beforeUpload = url.substring(0, uploadIndex + 8);
    const afterUpload = url.substring(uploadIndex + 8);

    const pathParts = afterUpload.split('/');
    let assetStartIndex = 0;

    // Skip transformation params or version
    if (
      pathParts[0] &&
      (pathParts[0].includes(',') || pathParts[0].match(/^v\d{10}$/))
    ) {
      assetStartIndex = 1;
    }

    const cleanPath = pathParts.slice(assetStartIndex).join('/');
    return `${beforeUpload}f_auto,q_auto/${cleanPath}`;
  } catch (e) {
    console.error('Error optimizing image URL:', e);
    return url;
  }
}

/**
 * Batch optimize multiple URLs
 */
export function optimizeImageUrls(urls: (string | null | undefined)[]): string[] {
  return urls.map(optimizeImageUrl);
}

/**
 * Optimize object with imageUrl property
 */
export function optimizeImageObject<T extends { imageUrl?: string | null }>(
  obj: T
): T {
  if (!obj.imageUrl) return obj;

  return {
    ...obj,
    imageUrl: optimizeImageUrl(obj.imageUrl),
  };
}

/**
 * Optimize array of objects with imageUrl property
 */
export function optimizeImageObjects<T extends { imageUrl?: string | null }>(
  objects: T[]
): T[] {
  return objects.map(optimizeImageObject);
}
