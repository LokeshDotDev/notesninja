import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all product types
export async function GET() {
  try {
    const productTypes = await prisma.productType.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            posts: true,
            featured: true,
          },
        },
      },
    });

    return NextResponse.json(productTypes);
  } catch (error) {
    console.error("Error fetching product types:", error);
    return NextResponse.json(
      { error: "Failed to fetch product types" },
      { status: 500 }
    );
  }
}

// POST create product type
export async function POST(request: Request) {
  try {
    let name;
    
    // Try to get JSON first
    try {
      const body = await request.json();
      console.log("Request body (JSON):", body);
      name = body.name;
    } catch (jsonError) {
      // If JSON parsing fails, try form data
      console.log("JSON parsing failed, trying form data");
      try {
        const formData = await request.formData();
        name = formData.get('name') as string;
        console.log("Request body (FormData):", name);
      } catch (formDataError) {
        console.error("Both JSON and FormData parsing failed");
        return NextResponse.json(
          { error: "Invalid request format" },
          { status: 400 }
        );
      }
    }
    
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Product type name is required" },
        { status: 400 }
      );
    }

    // Check if product type already exists
    const existingProductType = await prisma.productType.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingProductType) {
      return NextResponse.json(
        { error: "Product type with this name already exists" },
        { status: 409 }
      );
    }

    const productType = await prisma.productType.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(productType, { status: 201 });
  } catch (error) {
    console.error("Error creating product type:", error);
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    );
  }
}
