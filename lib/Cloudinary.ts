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
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Determine resource type based on file type and isDigital flag
		const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
		const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
		const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
		
		let resourceType: "raw" | "video" | "image" | "auto";
		if (isDigital || (!imageTypes.includes(fileExtension) && !videoTypes.includes(fileExtension))) {
			resourceType = 'raw'; // For digital files and non-image/video files
		} else if (videoTypes.includes(fileExtension)) {
			resourceType = 'video'; // For video files
		} else {
			resourceType = 'image'; // For image files
		}

		console.log(`Uploading file: ${file.name}, type: ${fileExtension}, resource_type: ${resourceType}, isDigital: ${isDigital}`);

		const uploadingResult = await new Promise<CloudinaryUploadResult>(
			(resolve, reject) => {
				const uploadOptions: any = { 
					folder: "Elevate-mortal", 
					resource_type: resourceType,
					type: 'upload', // Make file publicly accessible
					public_id: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
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

// Get accessible URL (use public URLs for all files)
export function getAccessibleUrl(secureUrl: string, publicId: string, resourceType: string = 'image'): string {
	// For raw files (ZIP, PDF, etc.), we need to ensure the URL works for download
	if (resourceType === 'raw') {
		// Try to use the original secure_url first, but ensure it has the correct format
		if (secureUrl && secureUrl.includes('cloudinary.com')) {
			// If it's already a raw URL, use it
			if (secureUrl.includes('/raw/upload/')) {
				console.log('Using existing raw URL:', secureUrl);
				return secureUrl;
			}
			// If it's an image URL, convert it to raw
			else if (secureUrl.includes('/image/upload/')) {
				const rawUrl = secureUrl.replace('/image/upload/', '/raw/upload/');
				console.log('Converted image URL to raw URL:', { original: secureUrl, converted: rawUrl });
				return rawUrl;
			}
		}
		
		// Fallback: generate a new URL using Cloudinary utils
		const cloudinaryUrl = cloudinary.utils.url(publicId, {
			resource_type: 'raw',
			type: 'upload',
			secure: true
		});
		
		console.log('Generated fallback Cloudinary URL:', cloudinaryUrl);
		return cloudinaryUrl;
	}
	
	// For images and videos, the secure_url should work directly
	return secureUrl;
}
export async function deleteContent(publicId: string): Promise<unknown> {
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
		
		// First try to delete as image
		let result = await cloudinary.uploader.destroy(publicId);
		console.log(`Delete result for ${publicId}:`, result);
		
		// If result is 'not found' as image, try to delete as raw resource
		if (result.result === 'not found') {
			console.log(`Trying to delete ${publicId} as raw resource...`);
			result = await cloudinary.uploader.destroy(publicId, { 
				resource_type: 'raw' 
			});
			console.log(`Raw delete result for ${publicId}:`, result);
		}
		
		return result;
	} catch (error) {
		console.error("Error deleting the content from Cloudinary:", error);
		throw new Error("Error deleting the content from Cloudinary!");
	}
}
