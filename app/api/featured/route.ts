import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadContent } from "@/lib/Cloudinary";
import { auth } from "@clerk/nextjs/server";

interface CloudinaryUploadResult {
	secure_url: string;
	public_id: string;
	[key: string]: string | number | boolean;
}

// GET all featured items
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const category = searchParams.get("category");

		const featuredItems = await prisma.featured.findMany({
			where: category ? { categoryId: category } : {},
			include: {
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
		const response = NextResponse.json(featuredItems);
		response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
		return response;
	} catch (error) {
		console.error("Error fetching featured:", error);
		return NextResponse.json(
			{ error: "Failed to fetch featured" },
			{ status: 500 }
		);
	}
}

// CREATE a new featured item
export async function POST(req: NextRequest) {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;
		const title = formData.get("title") as string;
		const descripition = formData.get("descripition") as string;
		const categoryId = formData.get("categoryId") as string;
		const subcategoryId = formData.get("subcategoryId") as string | null;
		const productTypeId = formData.get("productTypeId") as string | null;

		if (!file || !title || !descripition || !categoryId) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const result = (await uploadContent(file)) as CloudinaryUploadResult;

		const newFeatured = await prisma.featured.create({
			data: {
				title,
				descripition,
				imageUrl: result.secure_url,
				publicId: result.public_id,
				categoryId,
				subcategoryId: subcategoryId || null,
				productTypeId: productTypeId || null,
			},
			include: {
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

		return NextResponse.json(newFeatured, { status: 201 });
	} catch (error) {
		console.error("Error creating featured:", error);
		return NextResponse.json(
			{ error: "Failed to create featured" },
			{ status: 500 }
		);
	}
}
