import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Test endpoint to verify gallery functionality
export async function GET() {
  try {
    // Test 1: Check if PostImage model exists and has correct fields
    const testPost = await prisma.post.findFirst({
      include: {
        images: {
          select: {
            id: true,
            imageUrl: true,
            publicId: true,
            order: true,
            isCover: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!testPost) {
      return NextResponse.json({
        success: false,
        error: "No posts found to test with",
        message: "Create a test product first",
      });
    }

    // Test 2: Verify image structure
    const images = testPost.images;
    const coverImages = images.filter(img => img.isCover);
    const hasValidOrder = images.every((img, index) => img.order === index);

    return NextResponse.json({
      success: true,
      tests: {
        postImageModel: "✓ PostImage model exists with correct fields",
        imageStructure: images.length > 0 ? "✓ Images found" : "⚠ No images for this post",
        coverLogic: coverImages.length <= 1 ? "✓ Cover logic correct" : `✗ Multiple covers found: ${coverImages.length}`,
        orderLogic: hasValidOrder ? "✓ Order logic correct" : "✗ Order logic incorrect",
        imageCount: images.length,
        coverImageCount: coverImages.length,
      },
      sampleData: {
        postId: testPost.id,
        images: images.map(img => ({
          id: img.id,
          isCover: img.isCover,
          order: img.order,
        }))
      }
    });

  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to test gallery functionality"
    }, { status: 500 });
  }
}
