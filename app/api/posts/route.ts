import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadContent, CloudinaryUploadResult, getAccessibleUrl } from "@/lib/Cloudinary";

// Configure route to handle large file uploads
export const maxDuration = 300; // Increased to 5 minutes for large files
export const dynamic = 'force-dynamic'; // Disable static optimization

// GET all posts
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const category = searchParams.get("category");
		const subcategory = searchParams.get("subcategory");

		const posts = await prisma.post.findMany({
			where: category ? { categoryId: category } : subcategory ? { subcategoryId: subcategory } : {},
			include: {
				images: {
					orderBy: { order: "asc" },
				},
				digitalFiles: true,
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				subcategory: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		// Set cache headers (reduced cache time for better UX)
		const response = NextResponse.json(posts);
		response.headers.set("Cache-Control", "public, max-age=60, s-maxage=60"); // Reduced to 1 minute
		return response;
	} catch (error) {
		console.log("Error fetching posts:", error);
		return NextResponse.json(
			{ error: "Failed to fetch posts" },
			{ status: 500 }
		);
	}
}

// POST create new post (with multiple images upload)
export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();

		// Handle both multiple files and single file for backward compatibility
		const files = formData.getAll("files") as File[];
		const singleFile = formData.get("file") as File | null;
		const digitalFiles = formData.getAll("digitalFiles") as File[];

		const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const categoryId = formData.get("categoryId") as string;
		const subcategoryId = formData.get("subcategoryId") as string | null;
		const productTypeId = formData.get("productTypeId") as string | null;
		const price = formData.get("price") as string | null;
		const compareAtPrice = formData.get("compareAtPrice") as string | null;
		const isDigital = formData.get("isDigital") === "true";

		if (!title || !description || !categoryId) {
			return NextResponse.json(
				{ error: "Missing required fields: title, description, and category are required" },
				{ status: 400 }
			);
		}

		// Note: Files are optional - they can be added later via edit
		// Digital products should have files, but we'll allow creation without them for now

		// Create the post first
		const newPost = await prisma.post.create({
			data: {
				title,
				description,
				categoryId,
				subcategoryId: subcategoryId || null,
				productTypeId: productTypeId || null,
				price: price ? parseFloat(price) : null,
				compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
				isDigital,
			},
		});

		// Upload images to Cloudinary and create PostImage records (for all products)
		if (allFiles.length > 0) {
			const imagePromises = allFiles.map(async (file, index) => {
				const uploadResult: CloudinaryUploadResult = await uploadContent(file);

				return prisma.postImage.create({
					data: {
						postId: newPost.id,
						imageUrl: uploadResult.secure_url,
						publicId: uploadResult.public_id,
						order: index,
					},
				});
			});

			await Promise.all(imagePromises);
		}

		// Upload digital files to Cloudinary and create DigitalFile records (for digital products)
		if (digitalFiles.length > 0) {
			const filePromises = digitalFiles.map(async (file) => {
				const uploadResult: CloudinaryUploadResult = await uploadContent(file, true);
				
				// Determine resource type for URL generation
				const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
				const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
				const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
				let resourceType = 'raw';
				if (imageTypes.includes(fileExtension)) {
					resourceType = 'image';
				} else if (videoTypes.includes(fileExtension)) {
					resourceType = 'video';
				}
				
				// Generate accessible URL
				const accessibleUrl = getAccessibleUrl(uploadResult.secure_url, uploadResult.public_id, resourceType);

				return prisma.digitalFile.create({
					data: {
						postId: newPost.id,
						fileName: file.name,
						fileUrl: accessibleUrl,
						publicId: uploadResult.public_id,
						fileSize: file.size,
						fileType: file.name.split('.').pop() || 'unknown',
					},
				});
			});

			await Promise.all(filePromises);
		}

		// Return post with its images and digital files
		const postWithFiles = await prisma.post.findUnique({
			where: { id: newPost.id },
			include: {
				images: {
					orderBy: { order: "asc" },
				},
				digitalFiles: true,
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				subcategory: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return NextResponse.json(postWithFiles, { status: 201 });
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Failed to create post",
			},
			{ status: 500 }
		);
	}
}
