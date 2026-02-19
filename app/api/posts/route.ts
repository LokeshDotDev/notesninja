import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadContent, CloudinaryUploadResult, getAccessibleUrl } from "@/lib/Cloudinary";

// Configure route to handle large file uploads
// Note: 300 seconds only works on Vercel Pro+. Free tier is limited to 10 seconds.
export const dynamic = 'force-dynamic'; // Disable static optimization

// GET all posts
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const category = searchParams.get("category");
		const subcategory = searchParams.get("subcategory");

		const posts = await prisma.post.findMany({
			where: category ? { categoryId: category } : subcategory ? { subcategoryId: subcategory } : {},
			select: {
				id: true,
				title: true,
				slug: true,
				description: true,
				imageUrl: true,
				publicId: true,
				price: true,
				compareAtPrice: true,
				isDigital: true,
				createdAt: true,
				updatedAt: true,
				categoryId: true,
				subcategoryId: true,
				productTypeId: true,
				images: {
					select: {
						id: true,
						imageUrl: true,
						publicId: true,
						order: true,
					},
					orderBy: { order: "asc" },
				},
				digitalFiles: {
					select: {
						id: true,
						fileName: true,
						fileUrl: true,
						publicId: true,
						fileSize: true,
						fileType: true,
						postId: true,
						createdAt: true,
					}
				},
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
				productType: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		// Add cache-busting timestamp to imageUrl for all posts
		posts.forEach(post => {
			if (post.imageUrl) {
				const cacheBuster = Math.random().toString(36).substring(7);
				post.imageUrl = `${post.imageUrl}?v=${cacheBuster}`;
			}
		});

		// Set cache headers (reduced cache time for better UX)
		const response = NextResponse.json(posts);
		response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
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
	console.log("=== POST /api/posts - Start ===");
	
	try {
		// Log environment configuration
		console.log("Environment check:", {
			cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
			apiKey: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
			apiSecret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing",
			database: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing"
		});

		console.log("1. Parsing form data...");
		const formData = await req.formData();

		// Handle both multiple files and single file for backward compatibility
		const files = formData.getAll("files") as File[];
		const singleFile = formData.get("file") as File | null;
		const digitalFiles = formData.getAll("digitalFiles") as File[];

		const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const slug = formData.get("slug") as string | null;
		const categoryId = formData.get("categoryId") as string;
		const subcategoryId = formData.get("subcategoryId") as string | null;
		const productTypeId = formData.get("productTypeId") as string | null;
		const price = formData.get("price") as string | null;
		const compareAtPrice = formData.get("compareAtPrice") as string | null;
		const isDigital = formData.get("isDigital") === "true";

		// Auto-calculate compareAtPrice if not provided but price is given
		let finalCompareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : null;
		if (price && !finalCompareAtPrice) {
			finalCompareAtPrice = Math.round((parseFloat(price) * 1.5) / 100) * 100;
			console.log(`Auto-calculated compareAtPrice: ₹${finalCompareAtPrice} for price: ₹${price}`);
		}

		console.log("2. Extracted fields:", {
			title: title?.substring(0, 50),
			slug: slug || "auto-generated",
			categoryId,
			subcategoryId,
			isDigital,
			imageCount: allFiles.length,
			digitalFileCount: digitalFiles.length
		});

		if (!title || !description || !categoryId) {
			console.log("✗ Validation failed: Missing required fields");
			return NextResponse.json(
				{ error: "Missing required fields: title, description, and category are required" },
				{ status: 400 }
			);
		}

		// Note: Files are optional - they can be added later via edit
		// Digital products should have files, but we'll allow creation without them for now

		// Generate slug if not provided
		let finalSlug = slug;
		if (!finalSlug) {
			finalSlug = title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-+|-+$/g, '');
		}

		console.log("3. Creating post in database...");
		// Create the post first
		const newPost = await prisma.post.create({
			data: {
				title,
				slug: finalSlug || null,
				description,
				categoryId,
				subcategoryId: subcategoryId || null,
				productTypeId: productTypeId || null,
				price: price ? parseFloat(price) : null,
				compareAtPrice: finalCompareAtPrice,
				isDigital,
			},
		});
		console.log("✓ Post created in database:", newPost.id);

		// Upload images to Cloudinary and create PostImage records (for all products)
		if (allFiles.length > 0) {
			console.log(`4. Uploading ${allFiles.length} images to Cloudinary...`);
			const imagePromises = allFiles.map(async (file, index) => {
				console.log(`   - Uploading image ${index + 1}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
				const uploadResult: CloudinaryUploadResult = await uploadContent(file);
				console.log(`   ✓ Image ${index + 1} uploaded:`, uploadResult.public_id);

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
			console.log(`✓ All ${allFiles.length} images uploaded successfully`);
		} else {
			console.log("4. No images to upload");
		}

		// Upload digital files to Cloudinary and create DigitalFile records (for digital products)
		if (digitalFiles.length > 0) {
			console.log(`5. Uploading ${digitalFiles.length} digital files to Cloudinary...`);
			const filePromises = digitalFiles.map(async (file) => {
				console.log(`   - Uploading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
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
				console.log(`   ✓ File uploaded:`, uploadResult.public_id);

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
			console.log(`✓ All ${digitalFiles.length} digital files uploaded successfully`);
		} else {
			console.log("5. No digital files to upload");
		}

		console.log("6. Fetching complete post data...");
		// Return post with its images and digital files
		const postWithFiles = await prisma.post.findUnique({
			where: { id: newPost.id },
			select: {
				id: true,
				title: true,
				slug: true,
				description: true,
				imageUrl: true,
				publicId: true,
				price: true,
				compareAtPrice: true,
				isDigital: true,
				createdAt: true,
				updatedAt: true,
				categoryId: true,
				subcategoryId: true,
				productTypeId: true,
				images: {
					select: {
						id: true,
						imageUrl: true,
						publicId: true,
						order: true,
					},
					orderBy: { order: "asc" },
				},
				digitalFiles: {
					select: {
						id: true,
						fileName: true,
						fileUrl: true,
						publicId: true,
						fileSize: true,
						fileType: true,
						postId: true,
						createdAt: true,
					}
				},
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
				productType: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		console.log("=== POST /api/posts - Success ===");
		return NextResponse.json(postWithFiles, { status: 201 });
	} catch (error) {
		console.error("=== POST /api/posts - ERROR ===");
		console.error("Error details:", error);
		console.error("Error type:", typeof error);
		console.error("Error message:", error instanceof Error ? error.message : "No message");
		console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
		
		// Log additional debugging info
		console.error("Environment check at error time:", {
			cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
			apiKey: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing", 
			apiSecret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing",
			database: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing"
		});
		
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Failed to create post",
				details: process.env.NODE_ENV === 'development' ? {
					stack: error instanceof Error ? error.stack : String(error),
					type: typeof error,
					envCheck: {
						cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
						apiKey: !!process.env.CLOUDINARY_API_KEY,
						apiSecret: !!process.env.CLOUDINARY_API_SECRET,
						database: !!process.env.DATABASE_URL
					}
				} : undefined
			},
			{ status: 500 }
		);
	}
}
