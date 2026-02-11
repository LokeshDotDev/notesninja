import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
	CloudinaryUploadResult,
	deleteContent,
	uploadContent,
} from "@/lib/Cloudinary";
import { auth } from "@clerk/nextjs/server";

// GET single featured
export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const id = searchParams.get("id") as string;

		const featured = await prisma.featured.findUnique({
			where: { id },
			include: {
				category: true,
			},
		});

		if (!featured) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		return NextResponse.json(featured);
	} catch (error) {
		console.error("Error fetching single featured:", error);
		return NextResponse.json(
			{ error: "Failed to fetch featured" },
			{ status: 500 }
		);
	}
}

// UPDATE featured (Partial Update)
export async function PATCH(req: NextRequest) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const id = req.nextUrl.pathname.split("/").pop();

		const formData = await req.formData();
		const title = formData.get("title") as string | null;
		const descripition = formData.get("descripition") as string | null;
		const categoryId = formData.get("categoryId") as string | null;
		const authorId = formData.get("authorId") as string | null;
		const file = formData.get("file") as File | null;

		const existing = await prisma.featured.findUnique({ where: { id } });

		if (!existing) {
			return NextResponse.json(
				{ error: "Featured item not found" },
				{ status: 404 }
			);
		}

		const dataToUpdate: Partial<{
			title: string;
			descripition: string;
			categoryId: string;
			authorId: string;
			imageUrl: string;
			publicId: string;
		}> = {};

		if (title) dataToUpdate.title = title;
		if (descripition) dataToUpdate.descripition = descripition;
		if (categoryId) dataToUpdate.categoryId = categoryId;
		if (authorId) dataToUpdate.authorId = authorId;
		
		// If new image is provided
		if (file) {
			await deleteContent(existing.publicId);
			const uploadResult = (await uploadContent(
				file
			)) as CloudinaryUploadResult;

			dataToUpdate.imageUrl = uploadResult.secure_url;
			dataToUpdate.publicId = uploadResult.public_id;
		}

		if (Object.keys(dataToUpdate).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields provided for update" },
				{ status: 400 }
			);
		}

		const updated = await prisma.featured.update({
			where: { id },
			data: dataToUpdate,
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating featured:", error);
		return NextResponse.json({ error: "Failed to update" }, { status: 500 });
	}
}

// DELETE featured
export async function DELETE(req: NextRequest) {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const id = req.nextUrl.pathname.split("/").pop();

		const existing = await prisma.featured.findUnique({ where: { id } });

		if (!existing) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		await deleteContent(existing.publicId);

		const deleted = await prisma.featured.delete({ where: { id } });

		return NextResponse.json({ message: "Deleted successfully", deleted });
	} catch (error) {
		console.error("Error deleting featured:", error);
		return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
	}
}
