import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all categories
export async function GET() {
	try {
		const categories = await prisma.category.findMany({
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
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		return NextResponse.json(
			{ error: "Failed to fetch categories" },
			{ status: 500 }
		);
	}
}

// POST create new category
export async function POST(request: Request) {
	try {
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
			},
		});

		if (existingCategory) {
			return NextResponse.json(
				{ error: "Category with this name already exists" },
				{ status: 409 }
			);
		}

		const category = await prisma.category.create({
			data: {
				name: name.trim(),
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
