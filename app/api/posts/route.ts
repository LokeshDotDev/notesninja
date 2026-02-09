import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadContent, CloudinaryUploadResult } from "@/lib/Cloudinary";

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

		// Set cache headers
		const response = NextResponse.json(posts);
		response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
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

		const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

		const title = formData.get("title") as string | null;
		const description = formData.get("description") as string | null;
		const categoryId = formData.get("categoryId") as string | null;
		const subcategoryId = formData.get("subcategoryId") as string | null;
		const productTypeId = formData.get("productTypeId") as string | null;

		if (!allFiles.length || !title || !description || !categoryId) {
			return NextResponse.json(
				{ error: "Missing required fields or no images provided" },
				{ status: 400 }
			);
		}

		// Create the post first
		const newPost = await prisma.post.create({
			data: {
				title,
				description,
				categoryId,
				subcategoryId: subcategoryId || null,
				productTypeId: productTypeId || null,
			},
		});

		// Upload all images to Cloudinary and create PostImage records
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

		// Return post with its images
		const postWithImages = await prisma.post.findUnique({
			where: { id: newPost.id },
			include: {
				images: {
					orderBy: { order: "asc" },
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
			},
		});

		return NextResponse.json(postWithImages, { status: 201 });
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
