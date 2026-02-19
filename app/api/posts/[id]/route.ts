import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
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

		// Add cache-busting timestamp to imageUrl if it exists
		if (post.imageUrl) {
			const cacheBuster = Math.random().toString(36).substring(7);
			post.imageUrl = `${post.imageUrl}?v=${cacheBuster}`;
		}

		const response = NextResponse.json(post);
		response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
		return response;
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
	const session = await getSession();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const resolvedParams = await params;

		const formData = await req.formData();
		const title = formData.get("title") as string | null;
		const description = formData.get("description") as string | null;
		const categoryId = formData.get("categoryId") as string | null;
		// Handle both multiple files and single file for backward compatibility
		const files = formData.getAll("files") as File[];
		const singleFile = formData.get("file") as File | null;
		const file = files.length > 0 ? files[0] : singleFile;
		
		// Handle digital files
		const digitalFiles = formData.getAll("digitalFiles") as File[];

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
			console.log("🔄 Image update process started");
			console.log("📸 Existing post:", { 
				id: existingPost.id, 
				hasImage: !!existingPost.imageUrl, 
				publicId: existingPost.publicId 
			});
			
			// Get existing gallery images to delete them too
			const existingImages = await prisma.postImage.findMany({
				where: { postId: resolvedParams.id }
			});
			console.log("📸 Existing gallery images:", existingImages.length);
			
			// Delete main image if it exists
			if (existingPost.publicId) {
				console.log("🗑️ Deleting old main image from Cloudinary:", existingPost.publicId);
				const deleteResult = await deleteContent(existingPost.publicId);
				console.log("✅ Main image delete result:", deleteResult);
			}
			
			// Delete all gallery images from Cloudinary
			for (const image of existingImages) {
				if (image.publicId) {
					console.log("🗑️ Deleting gallery image from Cloudinary:", image.publicId);
					const deleteResult = await deleteContent(image.publicId);
					console.log("✅ Gallery image delete result:", deleteResult);
				}
			}

			console.log("⬆️ Uploading new image:", file.name);
			const uploadResult = (await uploadContent(
				file
			)) as CloudinaryUploadResult;

			console.log("✅ New image uploaded:", { 
				secure_url: uploadResult.secure_url, 
				public_id: uploadResult.public_id 
			});

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
			
			// Also update the first gallery image or create one if none exists
			if (existingImages.length > 0) {
				// Update the first gallery image
				await prisma.postImage.update({
					where: { id: existingImages[0].id },
					data: {
						imageUrl: uploadResult.secure_url,
						publicId: uploadResult.public_id,
					}
				});
				console.log("✅ Updated first gallery image");
			} else {
				// Create a new gallery image
				await prisma.postImage.create({
					data: {
						imageUrl: uploadResult.secure_url,
						publicId: uploadResult.public_id,
						order: 0,
						postId: resolvedParams.id,
					}
				});
				console.log("✅ Created new gallery image");
			}
		}

		// Handle digital files update
		if (digitalFiles.length > 0) {
			console.log("🔄 Digital files update process started");
			
			// Get existing digital files to delete them from Cloudinary
			const existingDigitalFiles = await prisma.digitalFile.findMany({
				where: { postId: resolvedParams.id }
			});
			console.log("📁 Existing digital files:", existingDigitalFiles.length);
			
			// Delete existing digital files from Cloudinary
			for (const digitalFile of existingDigitalFiles) {
				if (digitalFile.publicId) {
					console.log("🗑️ Deleting existing digital file from Cloudinary:", digitalFile.publicId);
					const deleteResult = await deleteContent(digitalFile.publicId);
					console.log("✅ Digital file delete result:", deleteResult);
				}
			}
			
			// Delete existing digital files from database
			await prisma.digitalFile.deleteMany({
				where: { postId: resolvedParams.id }
			});
			console.log("✅ Deleted existing digital files from database");
			
			// Upload new digital files
			console.log("⬆️ Uploading new digital files");
			const filePromises = digitalFiles.map(async (file) => {
				console.log(`   - Uploading digital file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
				const uploadResult: CloudinaryUploadResult = await uploadContent(file, true);
				console.log(`   ✓ Digital file uploaded:`, uploadResult.public_id);

				return prisma.digitalFile.create({
					data: {
						postId: resolvedParams.id,
						fileName: file.name,
						fileUrl: uploadResult.secure_url,
						publicId: uploadResult.public_id,
						fileSize: file.size,
						fileType: file.type,
					},
				});
			});

			await Promise.all(filePromises);
			console.log(`✓ All ${digitalFiles.length} digital files uploaded successfully`);
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

		// Add cache-busting timestamp to imageUrl if it was updated
		if (dataToUpdate.imageUrl) {
			const cacheBuster = Math.random().toString(36).substring(7);
			updatedPost.imageUrl = `${dataToUpdate.imageUrl}?v=${cacheBuster}`;
		}

		console.log("🎯 Final updated post data:", {
			id: updatedPost.id,
			title: updatedPost.title,
			imageUrl: updatedPost.imageUrl,
			publicId: updatedPost.publicId
		});

		const response = NextResponse.json(updatedPost);
		response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
		return response;
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
	const session = await getSession();

	if (!session?.user) {
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
