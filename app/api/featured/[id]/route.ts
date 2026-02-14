import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
	CloudinaryUploadResult,
	deleteContent,
	uploadContent,
} from "@/lib/Cloudinary";
import { getSession } from "@/lib/get-session";

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
	const session = await getSession();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const id = req.nextUrl.pathname.split("/").pop();

		const formData = await req.formData();
		const title = formData.get("title") as string | null;
		const descripition = formData.get("descripition") as string | null;
		const categoryId = formData.get("categoryId") as string | null;
		const authorId = formData.get("authorId") as string | null;
		// Handle both multiple files and single file for backward compatibility
		const files = formData.getAll("files") as File[];
		const singleFile = formData.get("file") as File | null;
		const file = files.length > 0 ? files[0] : singleFile;

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
			console.log("🔄 Featured image update process started");
			console.log("📸 Existing featured:", { 
				id: existing.id, 
				hasImage: !!existing.imageUrl, 
				publicId: existing.publicId 
			});
			
			await deleteContent(existing.publicId);
			console.log("🗑️ Deleted old featured image:", existing.publicId);
			
			const uploadResult = (await uploadContent(
				file
			)) as CloudinaryUploadResult;
			
			console.log("✅ New featured image uploaded:", { 
				secure_url: uploadResult.secure_url, 
				public_id: uploadResult.public_id 
			});

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

		// Add cache-busting timestamp to imageUrl if it was updated
		if (dataToUpdate.imageUrl) {
			updated.imageUrl = `${dataToUpdate.imageUrl}?t=${Date.now()}`;
		}

		console.log("🎯 Final updated featured data:", {
			id: updated.id,
			title: updated.title,
			imageUrl: updated.imageUrl,
			publicId: updated.publicId
		});

		const response = NextResponse.json(updated);
		response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
		return response;
	} catch (error) {
		console.error("Error updating featured:", error);
		return NextResponse.json({ error: "Failed to update" }, { status: 500 });
	}
}

// DELETE featured
export async function DELETE(req: NextRequest) {
	const session = await getSession();

	if (!session?.user) {
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
