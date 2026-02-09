import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
	CloudinaryUploadResult,
	deleteContent,
	uploadContent,
} from "@/lib/Cloudinary";

// GET Single Post
export async function GET(req: NextRequest) {
	try {
		const id = req.nextUrl.pathname.split("/").pop();

		const post = await prisma.post.findUnique({
			where: { id: id },
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
export async function PATCH(req: NextRequest) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const id = req.nextUrl.pathname.split("/").pop();

		const formData = await req.formData();
		const title = formData.get("title") as string | null;
		const description = formData.get("description") as string | null;
		const categoryId = formData.get("categoryId") as string | null;
		const file = formData.get("file") as File | null;

		const existingPost = await prisma.post.findUnique({
			where: { id },
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
			where: { id },
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
export async function DELETE(req: NextRequest) {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const id = req.nextUrl.pathname.split("/").pop();
		const post = await prisma.post.findUnique({
			where: { id: id },
		});

		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}

		// Delete from Cloudinary
		if (post.publicId) {
			await deleteContent(post.publicId);
		}

		// Delete from DB
		await prisma.post.delete({
			where: { id: id },
		});

		return NextResponse.json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error deleting post:", error);
		return NextResponse.json(
			{ error: "Failed to delete post" },
			{ status: 500 }
		);
	}
}
