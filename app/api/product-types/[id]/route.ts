import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single product type
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productType = await prisma.productType.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: {
            posts: true,
            featured: true,
          },
        },
      },
    });

    if (!productType) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(productType);
  } catch (error) {
    console.error("Error fetching product type:", error);
    return NextResponse.json(
      { error: "Failed to fetch product type" },
      { status: 500 }
    );
  }
}

// PUT update product type
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Product type name is required" },
        { status: 400 }
      );
    }

    const existingProductType = await prisma.productType.findFirst({
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

    if (existingProductType) {
      return NextResponse.json(
        { error: "Product type with this name already exists" },
        { status: 409 }
      );
    }

    const productType = await prisma.productType.update({
      where: { id: resolvedParams.id },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(productType);
  } catch (error) {
    console.error("Error updating product type:", error);
    return NextResponse.json(
      { error: "Failed to update product type" },
      { status: 500 }
    );
  }
}

// DELETE product type
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // Check if product type is being used
    const postsCount = await prisma.post.count({
      where: { productTypeId: resolvedParams.id },
    });

    const featuredCount = await prisma.featured.count({
      where: { productTypeId: resolvedParams.id },
    });

    if (postsCount > 0 || featuredCount > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete product type with existing posts or featured items. Please remove them first." 
        },
        { status: 400 }
      );
    }

    await prisma.productType.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json(
      { message: "Product type deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product type:", error);
    return NextResponse.json(
      { error: "Failed to delete product type" },
      { status: 500 }
    );
  }
}
