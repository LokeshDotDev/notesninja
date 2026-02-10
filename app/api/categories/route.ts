import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all categories (with nested structure)
export async function GET() {
	try {
		// Get all root categories (level 0) - simplified query first
		const rootCategories = await prisma.category.findMany({
			where: { parentId: null },
			include: {
				children: {
					include: {
						children: {
							include: {
								children: true, // Support up to 4 levels deep
							},
						},
					},
					orderBy: {
						name: "asc",
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(rootCategories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		return NextResponse.json(
			{ error: "Failed to fetch categories" },
			{ status: 500 }
		);
	}
}

// POST create new category (supports nested categories)
export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const name = formData.get("name") as string | null;
		const parentId = formData.get("parentId") as string | null;
		
		console.log("API received - name:", name, "parentId:", parentId);

		if (!name || typeof name !== "string" || name.trim() === "") {
			return NextResponse.json(
				{ error: "Category name is required" },
				{ status: 400 }
			);
		}

		// Generate slug from name
		const slug = name.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');

		// Check if slug already exists at the same level
		const existingCategory = await prisma.category.findFirst({
			where: {
				slug: slug,
				parentId: parentId || null, // Only check for duplicates at the same level
			},
		});

		if (existingCategory) {
			return NextResponse.json(
				{ error: "Category with this name already exists at this level" },
				{ status: 409 }
			);
		}

		// If parentId is provided, validate it and calculate level/path
		let level = 0;
		let path = slug;
		
		if (parentId && typeof parentId === "string") {
			const parentCategory = await prisma.category.findUnique({
				where: { id: parentId },
			});

			if (!parentCategory) {
				return NextResponse.json(
					{ error: "Parent category not found" },
					{ status: 404 }
				);
			}

			level = parentCategory.level + 1;
			path = parentCategory.path ? `${parentCategory.path}/${slug}` : slug;
		}

		const category = await prisma.category.create({
			data: {
				name: name.trim(),
				slug,
				parentId: parentId || null,
				level,
				path,
			},
		});

		return NextResponse.json(category, { status: 201 });
	} catch (error) {
		console.error("Error creating category:", error);
		return NextResponse.json(
			{ error: "Failed to create category" },
			{ status: 500 }
		);
	}
}
