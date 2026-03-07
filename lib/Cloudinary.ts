import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Interface for Cloudinary upload result
export interface CloudinaryUploadResult {
	public_id: string;
	secure_url: string;
	[key: string]: unknown;
}

// Constants for file size limits
const MAX_IMAGE_SIZE = 100 * 1024 * 1024 * 1024; // 100GB for images
const MAX_FILE_SIZE = 100 * 1024 * 1024 * 1024; // 100GB for digital files

// Upload content to Cloudinary
export async function uploadContent(
	file: File,
	isDigital: boolean = false
): Promise<CloudinaryUploadResult> {
	if (
		!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
		!process.env.CLOUDINARY_API_KEY ||
		!process.env.CLOUDINARY_API_SECRET
	) {
		throw new Error(
			"Cloudinary credentials are not found, please provide the credentials first and start uploading the content in Cloudinary!"
		);
	}

	try {
		// Validate file size before upload
		const maxSize = isDigital ? MAX_FILE_SIZE : MAX_IMAGE_SIZE;
		if (file.size > maxSize) {
			const maxSizeMB = maxSize / (1024 * 1024);
			throw new Error(
				`File "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum allowed size of ${maxSizeMB}MB`
			);
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Determine resource type based on file type and isDigital flag
		const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
		const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
		const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
		const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
		const sanitizedBaseName = sanitizedFileName.replace(/\.[^/.]+$/, '');
		
		let resourceType: "raw" | "video" | "image" | "auto";
		if (isDigital || (!imageTypes.includes(fileExtension) && !videoTypes.includes(fileExtension))) {
			resourceType = 'raw'; // For digital files and non-image/video files
		} else if (videoTypes.includes(fileExtension)) {
			resourceType = 'video'; // For video files
		} else {
			resourceType = 'image'; // For image files
		}

		console.log(`Uploading file: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB, type: ${fileExtension}, resource_type: ${resourceType}, isDigital: ${isDigital}`);

		interface UploadOptions {
	folder: string;
	resource_type: 'raw' | 'video' | 'image' | 'auto';
	type: string;
	public_id: string;
	use_filename: boolean;
	unique_filename: boolean;
	access_mode: string;
	secure: boolean;
	format?: string;
}

const uploadingResult = await new Promise<CloudinaryUploadResult>(
			(resolve, reject) => {
				const uploadOptions: UploadOptions = { 
					folder: "Elevate-mortal", 
					resource_type: resourceType,
					type: 'upload', // Make file publicly accessible
					public_id: resourceType === 'raw' ? sanitizedFileName : sanitizedBaseName,
					use_filename: true,
					unique_filename: true,
					access_mode: 'public', // Ensure public access
					secure: true
				};

				// For raw files, ensure they are publicly accessible
				if (resourceType === 'raw') {
					uploadOptions.access_mode = 'public';
					uploadOptions.type = 'upload';
					uploadOptions.secure = true;
					// Add delivery type for raw files
					uploadOptions.format = fileExtension;
				}

				const uploadStream = cloudinary.uploader.upload_stream(
					uploadOptions,
					(error, result) => {
						if (error || !result) {
							reject(error || new Error("Cloudinary upload failed"));
						} else {
							// For raw files, generate signed URL manually
							if (resourceType === 'raw') {
								const signedUrl = generateSignedUrl(result.public_id, 'raw');
								result.secure_url = signedUrl;
								console.log('Generated signed URL for raw file:', signedUrl);
							}
							resolve(result as CloudinaryUploadResult);
						}
					}
				);

				uploadStream.end(buffer);
			}
		);

		return uploadingResult;
	} catch (error) {
		console.error("Error uploading the content to Cloudinary:", error);
		throw new Error("Error uploading the content to Cloudinary!");
	}
}

// Generate signed URL for secure access
export function generateSignedUrl(publicId: string, resourceType: string = 'image'): string {
	const timestamp = Math.round(new Date().getTime() / 1000);
	const signature = cloudinary.utils.api_sign_request(
		{ public_id: publicId, timestamp: timestamp, type: 'upload' },
		process.env.CLOUDINARY_API_SECRET || ''
	);

	const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
	const signedUrl = `${baseUrl}/s--${signature}--/${publicId}`;
	
	// Debug: Check signature generation
	console.log('Cloudinary lib signature:', { public_id: publicId, timestamp, type: 'upload', signature });
	
	return signedUrl;
}

/**
 * Generate an optimized delivery URL for Cloudinary images
 * Adds transformation parameters for automatic format conversion (WebP/AVIF)
 * and quality optimization without modifying stored images
 * 
 * @param url - Original Cloudinary URL or public_id
 * @param options - Optimization options
 * @returns Optimized URL with transformation parameters
 */
export function getOptimizedImageUrl(
	url: string | null | undefined,
	options: {
		width?: number;
		quality?: string | number;
		format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
		crop?: 'limit' | 'fill' | 'scale' | 'fit';
	} = {}
): string {
	if (!url) return '';
	
	const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	if (!cloudName) return url;
	
	const width = options.width || 800;
	const quality = options.quality || 'auto';
	const format = options.format || 'auto';
	const crop = options.crop || 'limit';
	
	// Check if it's already a full Cloudinary URL
	if (url.includes('res.cloudinary.com')) {
		const uploadIndex = url.indexOf('/upload/');
		if (uploadIndex === -1) return url;
		
		// Extract base URL and asset path
		const baseUrl = url.substring(0, uploadIndex + 8);
		const assetPath = url.substring(uploadIndex + 8);
		
		// Remove existing transformation parameters
		const pathParts = assetPath.split('/');
		let cleanPath = assetPath;
		
		// Skip transformation params and version numbers
		if (pathParts[0] && (pathParts[0].match(/^v\d+$/) || pathParts[0].includes('_') || pathParts[0].includes(','))) {
			let assetStartIndex = 0;
			for (let i = 0; i < pathParts.length; i++) {
				if (pathParts[i].match(/^v\d+$/) || pathParts[i].includes('_') || pathParts[i].includes(',')) {
					continue;
				}
				assetStartIndex = i;
				break;
			}
			cleanPath = pathParts.slice(assetStartIndex).join('/');
		}
		
		// Build optimized URL with transformation parameters
		const params = [`f_${format}`, `q_${quality}`, `w_${width}`, `c_${crop}`].join(',');
		return `${baseUrl}${params}/${cleanPath}`;
	}
	
	// If it's just a public_id, build the full URL
	const params = [`f_${format}`, `q_${quality}`, `w_${width}`, `c_${crop}`].join(',');
	return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${url}`;
}

// Get accessible URL (use signed URLs for all files to ensure access)
export function getAccessibleUrl(secureUrl: string, publicId: string, resourceType: string = 'image'): string {
	console.log('Getting accessible URL for:', { secureUrl, publicId, resourceType });
	
	// For all files, generate a proper signed URL to ensure access
	const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	if (!cloudName) {
		console.error('Missing Cloudinary cloud name');
		return secureUrl; // Fallback to original
	}
	
	// Generate signed URL using Cloudinary utils
	const signedUrl = cloudinary.utils.url(publicId, {
		resource_type: resourceType,
		type: 'upload',
		secure: true,
		sign_url: true, // Ensure we get a signed URL
		expire_at: Math.floor(Date.now() / 1000) + 3600 // Expire in 1 hour
	});
	
	console.log('Generated signed URL:', signedUrl);
	return signedUrl;
}

export async function deleteContent(
	publicId: string,
	resourceType: "image" | "video" | "raw" = "image"
): Promise<unknown> {
	if (
		!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
		!process.env.CLOUDINARY_API_KEY ||
		!process.env.CLOUDINARY_API_SECRET
	) {
		throw new Error(
			"Cloudinary credentials are not found, please provide the credentials first and start deleting the content from Cloudinary!"
		);
	}

	try {
		console.log(`Attempting to delete Cloudinary resource: ${publicId}`);

		// Try different variations of the public_id
		const variations = [
			publicId, // Original public_id
			`${publicId}.jpg`, // With .jpg extension
			`${publicId}.jpeg`, // With .jpeg extension
			`${publicId}.png`, // With .png extension
		];

		const priorityResourceTypes: Array<"image" | "video" | "raw"> = [
			resourceType,
			...(["image", "video", "raw"] as const).filter((t) => t !== resourceType),
		]

		for (const type of priorityResourceTypes) {
			for (const variation of variations) {
				console.log(`Trying to delete as ${type}: ${variation}`);
				const result = await cloudinary.uploader.destroy(variation, {
					resource_type: type,
				});
				console.log(`Delete result for ${type}/${variation}:`, result);

				if (result.result === "ok" || result.result === "deleted") {
					console.log(`✅ Successfully deleted (${type}): ${variation}`);
					return result;
				}
			}
		}
		
		// If nothing worked, return the last result
		console.log(`❌ Could not delete any variation of: ${publicId}`);
		return { result: 'not found' };
		
	} catch (error) {
		console.error("Error deleting the content from Cloudinary:", error);
		throw new Error("Error deleting the content from Cloudinary!");
	}
}
