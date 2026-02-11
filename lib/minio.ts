import * as Minio from 'minio';

// Initialize MinIO client
const minioClient = new Minio.Client({
	endPoint: process.env.MINIO_ENDPOINT || '72.62.241.128',
	port: parseInt(process.env.MINIO_PORT || '9000'),
	useSSL: process.env.MINIO_USE_SSL === 'true' ? true : false,
	accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
	secretKey: process.env.MINIO_ROOT_PASSWORD || '',
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'elevate-mortal';

export interface MinioUploadResult {
	public_id: string;
	secure_url: string;
	bucket: string;
	object_name: string;
	size: number;
	etag: string;
}

/**
 * Upload file to MinIO
 * Supports files of any size with streaming
 */
export async function uploadContent(
	file: File,
	isDigital: boolean = false
): Promise<MinioUploadResult> {
	if (
		!process.env.MINIO_ENDPOINT ||
		!process.env.MINIO_ROOT_USER ||
		!process.env.MINIO_ROOT_PASSWORD
	) {
		throw new Error(
			'MinIO credentials are not configured. Please set MINIO_ENDPOINT, MINIO_ROOT_USER, and MINIO_ROOT_PASSWORD in your .env.local'
		);
	}

	try {
		// Check if bucket exists, create if not
		const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
		if (!bucketExists) {
			console.log(`Creating bucket: ${BUCKET_NAME}`);
			await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
		}

		// Generate unique object name
		const timestamp = Date.now();
		const randomStr = Math.random().toString(36).substring(2, 8);
		const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
		const objectName = `${isDigital ? 'digital-files' : 'images'}/${timestamp}-${randomStr}-${safeFileName}`;

		console.log(`Uploading to MinIO: ${objectName}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

		// Convert File to Buffer for MinIO
		const buffer = await file.arrayBuffer();
		const bufferData = Buffer.from(buffer);

		// Upload with metadata
		const metadata = {
			'Content-Type': file.type || 'application/octet-stream',
			'X-Amz-Meta-Original-Name': file.name,
			'X-Amz-Meta-Upload-Date': new Date().toISOString(),
			'X-Amz-Meta-Is-Digital': isDigital.toString(),
		};

		const uploadResult = await minioClient.putObject(
			BUCKET_NAME,
			objectName,
			bufferData,
			bufferData.length,
			metadata
		);

		// Generate download URL
		const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
		const endpoint = process.env.MINIO_ENDPOINT || '72.62.241.128';
		const port = process.env.MINIO_PORT || '9000';
		const baseUrl = `${protocol}://${endpoint}:${port}`;
		const secure_url = `${baseUrl}/${BUCKET_NAME}/${objectName}`;

		console.log(`Successfully uploaded to MinIO: ${secure_url}`);

		return {
			public_id: objectName,
			secure_url,
			bucket: BUCKET_NAME,
			object_name: objectName,
			size: file.size,
			etag: uploadResult.etag || '',
		};
	} catch (error) {
		console.error('Error uploading to MinIO:', error);
		throw new Error(`Error uploading file to MinIO: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Delete file from MinIO
 */
export async function deleteContent(objectName: string): Promise<void> {
	if (
		!process.env.MINIO_ENDPOINT ||
		!process.env.MINIO_ROOT_USER ||
		!process.env.MINIO_ROOT_PASSWORD
	) {
		throw new Error('MinIO credentials are not configured');
	}

	try {
		console.log(`Attempting to delete from MinIO: ${objectName}`);
		await minioClient.removeObject(BUCKET_NAME, objectName);
		console.log(`Successfully deleted from MinIO: ${objectName}`);
	} catch (error) {
		console.error('Error deleting from MinIO:', error);
		throw new Error(`Error deleting file from MinIO: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Get accessible URL for a file
 */
export function getAccessibleUrl(secure_url: string, _publicId?: string, _resourceType?: string): string {
	// MinIO URLs are already accessible, just return as-is
	return secure_url;
}

/**
 * Generate presigned URL for temporary access
 * Useful for download links that expire after some time
 */
export async function generatePresignedUrl(
	objectName: string,
	expirySeconds: number = 3600 // 1 hour default
): Promise<string> {
	try {
		const url = await minioClient.presignedGetObject(BUCKET_NAME, objectName, expirySeconds);
		console.log(`Generated presigned URL for ${objectName}, expires in ${expirySeconds}s`);
		return url;
	} catch (error) {
		console.error('Error generating presigned URL:', error);
		throw new Error(`Error generating presigned URL: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * List all files in a folder
 */
export async function listFiles(prefix: string = ''): Promise<string[]> {
	try {
		const files: string[] = [];
		const objectsList = await minioClient.listObjects(BUCKET_NAME, prefix, true);

		for await (const obj of objectsList) {
			if (obj.name) {
				files.push(obj.name);
			}
		}

		return files;
	} catch (error) {
		console.error('Error listing files:', error);
		throw new Error(`Error listing files: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Get file information
 */
export async function getFileInfo(objectName: string): Promise<Minio.BucketItemStat> {
	try {
		const stat = await minioClient.statObject(BUCKET_NAME, objectName);
		return stat;
	} catch (error) {
		console.error('Error getting file info:', error);
		throw new Error(`Error getting file info: ${error instanceof Error ? error.message : String(error)}`);
	}
}

export default minioClient;
