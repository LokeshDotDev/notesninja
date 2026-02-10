import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
	CloudinaryUploadResult,
	deleteContent,
	uploadContent,
} from "@/lib/Cloudinary";

// GET Single Post
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const resolvedParams = await params;

		const post = await prisma.post.findUnique({
			where: { id: resolvedParams.id },
			include: {
				images: true,
				digitalFiles: true,
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
						path: true,
						parent: {
							select: {
								id: true,
								name: true,
								slug: true,
								path: true,
							},
						},
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

		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		return NextResponse.json(post);
	} catch (error) {
		console.error("Error fetching post:", error);
		return NextResponse.json(
			{ error: "Failed to fetch post" },
			{ status: 500 }
		);
	}
}

// UPDATE Post (Partial update)
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const resolvedParams = await params;

		const formData = await req.formData();
		const title = formData.get("title") as string | null;
		const description = formData.get("description") as string | null;
		const categoryId = formData.get("categoryId") as string | null;
		const file = formData.get("file") as File | null;

		const existingPost = await prisma.post.findUnique({
			where: { id: resolvedParams.id },
		});

		if (!existingPost) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		const dataToUpdate: {
			title?: string;
			description?: string;
			categoryId?: string;
			imageUrl?: string;
			publicId?: string;
		} = {};

		if (title) dataToUpdate.title = title;
		if (description) dataToUpdate.description = description;
		if (categoryId) dataToUpdate.categoryId = categoryId;
		
		// If a new image is uploaded, replace the old one
		if (file) {
			if (existingPost.publicId) {
				await deleteContent(existingPost.publicId);
			}

			const uploadResult = (await uploadContent(
				file
			)) as CloudinaryUploadResult;

			if (
				!uploadResult ||
				typeof uploadResult !== "object" ||
				!("secure_url" in uploadResult) ||
				!("public_id" in uploadResult)
			) {
				return NextResponse.json(
					{ error: "Failed to upload image" },
					{ status: 500 }
				);
			}

			dataToUpdate.imageUrl = uploadResult.secure_url;
			dataToUpdate.publicId = uploadResult.public_id;
		}

		if (Object.keys(dataToUpdate).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields provided for update" },
				{ status: 400 }
			);
		}

		const updatedPost = await prisma.post.update({
			where: { id: resolvedParams.id },
			data: dataToUpdate,
		});

		return NextResponse.json(updatedPost);
	} catch (error) {
		console.error("Error updating post:", error);
		return NextResponse.json(
			{ error: "Failed to update post" },
			{ status: 500 }
		);
	}
}

// DELETE Post
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const resolvedParams = await params;
		const post = await prisma.post.findUnique({
			where: { id: resolvedParams.id },
			include: {
				images: true, // Include all associated images
				digitalFiles: true, // Include digital files
			},
		});

		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		// Delete all associated images from Cloudinary
		const cloudinaryDeletions = [];
		
		// Delete main image if it exists
		if (post.publicId) {
			cloudinaryDeletions.push(deleteContent(post.publicId));
		}
		
		// Delete all additional images from PostImage table
		for (const image of post.images) {
			if (image.publicId) {
				cloudinaryDeletions.push(deleteContent(image.publicId));
			}
		}
		
		// Delete digital files from Cloudinary
		console.log("Digital files to delete:", post.digitalFiles || []);
		for (const file of post.digitalFiles || []) {
			if (file.publicId) {
				console.log(`Deleting digital file: ${file.fileName} with publicId: ${file.publicId}`);
				cloudinaryDeletions.push(deleteContent(file.publicId));
			}
		}
		
		// Wait for all Cloudinary deletions to complete
		const deletionResults = await Promise.allSettled(cloudinaryDeletions);
		
		// Log any deletion failures
		const totalFiles = cloudinaryDeletions.length;
		console.log(`Attempting to delete ${totalFiles} files from Cloudinary...`);
		
		deletionResults.forEach((result, index) => {
			if (result.status === 'rejected') {
				console.error(`Failed to delete Cloudinary file ${index + 1}/${totalFiles}:`, result.reason);
			} else {
				console.log(`Successfully deleted Cloudinary file ${index + 1}/${totalFiles}:`, result.value);
			}
		});

		// Delete from DB (this will cascade delete the PostImage records)
		await prisma.post.delete({
			where: { id: resolvedParams.id },
		});

		const response = NextResponse.json({ message: "Post deleted successfully" });
		response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
		return response;
	} catch (error) {
		console.error("Error deleting post:", error);
		return NextResponse.json(
			{ error: "Failed to delete post" },
			{ status: 500 }
		);
	}
}
