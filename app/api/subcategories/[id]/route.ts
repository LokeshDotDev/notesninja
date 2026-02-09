import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single subcategory (by ID or name)
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const resolvedParams = await params;
		// Try to find by ID first, then by name
		let subcategory = await prisma.subcategory.findUnique({
			where: { id: resolvedParams.id },
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

		// If not found by ID, try by name
		if (!subcategory) {
			subcategory = await prisma.subcategory.findFirst({
				where: {
					name: {
						equals: decodeURIComponent(resolvedParams.id),
						mode: "insensitive",
					},
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
		}

		if (!subcategory) {
			return NextResponse.json(
				{ error: "Subcategory not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(subcategory);
	} catch (error) {
		console.error("Error fetching subcategory:", error);
		return NextResponse.json(
			{ error: "Failed to fetch subcategory" },
			{ status: 500 }
		);
	}
}

// PUT update subcategory
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const resolvedParams = await params;
		const formData = await request.formData();
		const name = formData.get("name") as string | null;
		const categoryId = formData.get("categoryId") as string | null;

		if (!name || typeof name !== "string" || name.trim() === "") {
			return NextResponse.json(
				{ error: "Subcategory name is required" },
				{ status: 400 }
			);
		}

		if (!categoryId || typeof categoryId !== "string") {
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

		// Check if subcategory with same name already exists in this category (excluding current one)
		const existingSubcategory = await prisma.subcategory.findFirst({
			where: {
				name: {
					equals: name.trim(),
					mode: "insensitive",
				},
				categoryId,
				NOT: {
					id: resolvedParams.id,
				},
			},
		});

		if (existingSubcategory) {
			return NextResponse.json(
				{ error: "Subcategory with this name already exists in this category" },
				{ status: 409 }
			);
		}

		const subcategory = await prisma.subcategory.update({
			where: { id: resolvedParams.id },
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

		return NextResponse.json(subcategory);
	} catch (error) {
		console.error("Error updating subcategory:", error);
		return NextResponse.json(
			{ error: "Failed to update subcategory" },
			{ status: 500 }
		);
	}
}

// DELETE subcategory
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const resolvedParams = await params;
		// Check if subcategory has posts
		const postCount = await prisma.post.count({
			where: { subcategoryId: resolvedParams.id },
		});

		if (postCount > 0) {
			return NextResponse.json(
				{ 
					error: "Cannot delete subcategory with existing posts. Please move or delete the posts first." 
				},
				{ status: 400 }
			);
		}

		// Delete the subcategory
		await prisma.subcategory.delete({
			where: { id: resolvedParams.id },
		});

		return NextResponse.json(
			{ message: "Subcategory deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting subcategory:", error);
		return NextResponse.json(
			{ error: "Failed to delete subcategory" },
			{ status: 500 }
		);
	}
}
