'use client'

/**
 * Custom Cloudinary loader for Next.js Image component
 * Automatically applies optimization parameters:
 * - f_auto: Auto format (WebP/AVIF when supported)
 * - q_auto: Auto quality compression
 * - w_: Responsive width
 * - c_limit: Limit size while maintaining aspect ratio
 */
export default function cloudinaryLoader({ src, width }) { // eslint-disable-line no-unused-vars
  // Only apply Cloudinary transformations to Cloudinary URLs
  if (!src || !src.includes('res.cloudinary.com')) {
    // For non-Cloudinary images, use Next.js default behavior
    // Return the URL with width parameter for Next.js to handle
    return src
  }
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dtan6xot2'
  
  try {
    const uploadIndex = src.indexOf('/upload/')
    if (uploadIndex !== -1) {
      // Everything after /upload/
      let afterUpload = src.substring(uploadIndex + 8)
      
      // Split the path
      const pathParts = afterUpload.split('/')
      
      // Find where transformations end and actual asset begins
      // Transformations are usually the first segment and contain commas
      let assetStartIndex = 0
      
      // Only skip first part if it contains commas (transformation syntax)
      if (pathParts[0] && pathParts[0].includes(',')) {
        assetStartIndex = 1
      }
      // Or if it's a version number like v1234567890
      else if (pathParts[0] && pathParts[0].match(/^v\d{10}$/)) {
        assetStartIndex = 1
      }
      
      // Reconstruct the public path
      const cleanPath = pathParts.slice(assetStartIndex).join('/')
      
      // Build optimized URL
      const params = ['f_auto', 'q_auto', `w_${width}`, 'c_limit'].join(',')
      return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${cleanPath}`
    }
  } catch (e) {
    console.error('Cloudinary loader error:', e)
    return src // Return original if error
  }
  
  return src
}
