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
