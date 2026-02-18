import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const oldPath = searchParams.get('from');
    
    // Find the product to get its category information
    const product = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            path: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
                path: true,
              },
            },
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

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Build the new SEO-friendly URL
    let newPath = '';
    
    if (product.category?.path) {
      // Use the full path from category
      const pathParts = product.category.path.split('/').filter(Boolean);
      if (pathParts.length >= 1) {
        // Format: /full/category/path/product-id
        newPath = `/${pathParts.join('/')}/${resolvedParams.id}`;
      }
    } else if (product.category?.slug) {
      // Fallback to category slug
      newPath = `/${product.category.slug}/${resolvedParams.id}`;
    }

    if (newPath && newPath !== oldPath) {
      return NextResponse.redirect(new URL(newPath, request.url), 301);
    }

    // If we can't build a new path, just show the product
    return NextResponse.redirect(new URL(`/product/${resolvedParams.id}`, request.url), 302);
  } catch (error) {
    console.error("Error in redirect:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
