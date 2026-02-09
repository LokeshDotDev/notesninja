import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all subcategories or subcategories for a specific category
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const categoryId = searchParams.get("categoryId");

		const subcategories = await prisma.subcategory.findMany({
			where: categoryId ? { categoryId } : undefined,
			include: {
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				_count: {
					select: {
						posts: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(subcategories);
	} catch (error) {
		console.error("Error fetching subcategories:", error);
		return NextResponse.json(
			{ error: "Failed to fetch subcategories" },
			{ status: 500 }
		);
	}
}

// POST create new subcategory
export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const name = formData.get("name") as string | null;
		const categoryId = formData.get("categoryId") as string | null;

	// Debug logging
		console.log("Subcategory creation data:", { name, categoryId });

		if (!name || typeof name !== "string" || name.trim() === "") {
			console.log("Validation failed - name:", { name, type: typeof name, trimmed: name?.trim() });
			return NextResponse.json(
				{ error: "Subcategory name is required" },
				{ status: 400 }
			);
		}

		if (!categoryId || typeof categoryId !== "string") {
			console.log("Validation failed - categoryId:", { categoryId, type: typeof categoryId });
			return NextResponse.json(
				{ error: "Category ID is required" },
				{ status: 400 }
			);
		}

		// Check if category exists
		const category = await prisma.category.findUnique({
			where: { id: categoryId },
		});

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		// Check if subcategory with same name already exists in this category
		const existingSubcategory = await prisma.subcategory.findFirst({
			where: {
				name: {
					equals: name.trim(),
					mode: "insensitive",
				},
				categoryId,
			},
		});

		if (existingSubcategory) {
			return NextResponse.json(
				{ error: "Subcategory with this name already exists in this category" },
				{ status: 409 }
			);
		}

		const subcategory = await prisma.subcategory.create({
			data: {
				name: name.trim(),
				categoryId,
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				_count: {
					select: {
						posts: true,
					},
				},
			},
		});

		return NextResponse.json(subcategory, { status: 201 });
	} catch (error) {
		console.error("Error creating subcategory:", error);
		return NextResponse.json(
			{ error: "Failed to create subcategory" },
			{ status: 500 }
		);
	}
}
