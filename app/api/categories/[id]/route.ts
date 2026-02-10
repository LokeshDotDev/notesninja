import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single category (by ID or name)
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const resolvedParams = await params;
		const categoryId = resolvedParams.id;

		// Try to find by ID first, then by name
		let category = await prisma.category.findUnique({
			where: { id: categoryId },
			include: {
				subcategories: {
					select: {
						id: true,
						name: true,
						_count: {
							select: {
								posts: true,
							},
						},
					},
					orderBy: {
						name: "asc",
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
		if (!category) {
			category = await prisma.category.findFirst({
				where: {
					name: {
						equals: decodeURIComponent(categoryId),
						mode: "insensitive",
					},
				},
				include: {
					subcategories: {
						select: {
							id: true,
							name: true,
							_count: {
								select: {
									posts: true,
								},
							},
						},
						orderBy: {
							name: "asc",
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

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(category);
	} catch (error) {
		console.error("Error fetching category:", error);
		return NextResponse.json(
			{ error: "Failed to fetch category" },
			{ status: 500 }
		);
	}
}

// PUT update category
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const resolvedParams = await params;
		const formData = await request.formData();
		const name = formData.get("name") as string | null;

		if (!name || typeof name !== "string" || name.trim() === "") {
			return NextResponse.json(
				{ error: "Category name is required" },
				{ status: 400 }
			);
		}

		const existingCategory = await prisma.category.findFirst({
			where: {
				name: {
					equals: name.trim(),
					mode: "insensitive",
				},
				NOT: {
					id: resolvedParams.id,
				},
			},
		});

		if (existingCategory) {
			return NextResponse.json(
				{ error: "Category with this name already exists" },
				{ status: 409 }
			);
		}

		const category = await prisma.category.update({
			where: { id: resolvedParams.id },
			data: {
				name: name.trim(),
			},
			include: {
				subcategories: {
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

		return NextResponse.json(category);
	} catch (error) {
		console.error("Error updating category:", error);
		return NextResponse.json(
			{ error: "Failed to update category" },
			{ status: 500 }
		);
	}
}

// DELETE category
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const resolvedParams = await params;
		// Check if category has posts
		const postCount = await prisma.post.count({
			where: { categoryId: resolvedParams.id },
		});

		if (postCount > 0) {
			return NextResponse.json(
				{ 
					error: "Cannot delete category with existing posts. Please move or delete the posts first." 
				},
				{ status: 400 }
			);
		}

		// Delete subcategories first
		await prisma.subcategory.deleteMany({
			where: { categoryId: resolvedParams.id },
		});

		// Delete the category
		await prisma.category.delete({
			where: { id: resolvedParams.id },
		});

		return NextResponse.json(
			{ message: "Category deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting category:", error);
		return NextResponse.json(
			{ error: "Failed to delete category" },
			{ status: 500 }
		);
	}
}
