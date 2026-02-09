import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECREAT,
});

// Interface for Cloudinary upload result
export interface CloudinaryUploadResult {
	public_id: string;
	secure_url: string;
	[key: string]: unknown;
}

// Upload content to Cloudinary
export async function uploadContent(
	file: File
): Promise<CloudinaryUploadResult> {
	if (
		!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
		!process.env.CLOUDINARY_API_KEY ||
		!process.env.CLOUDINARY_API_SECREAT
	) {
		throw new Error(
			"Cloudinary credentials are not found, please provide the credentials first and start uploading the content in Cloudinary!"
		);
	}

	try {
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const uploadingResult = await new Promise<CloudinaryUploadResult>(
			(resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{ folder: "Elevate-mortal", resource_type: "auto" }, // Fixed typo: moratl -> mortal
					(error, result) => {
						if (error || !result) {
							reject(error || new Error("Cloudinary upload failed"));
						} else {
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

// Delete content from Cloudinary
export async function deleteContent(publicId: string): Promise<unknown> {
	if (
		!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
		!process.env.CLOUDINARY_API_KEY ||
		!process.env.CLOUDINARY_API_SECREAT
	) {
		throw new Error(
			"Cloudinary credentials are not found, please provide the credentials first and start deleting the content from Cloudinary!"
		);
	}

	try {
		const deletingResult = await cloudinary.uploader.destroy(publicId);
		return deletingResult;
	} catch (error) {
		console.error("Error deleting the content from Cloudinary:", error);
		throw new Error("Error deleting the content from Cloudinary!");
	}
}
