import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import { deleteContent } from "@/lib/Cloudinary";

/* ------------------------------------------------ */
/* DELETE - Remove single image from gallery        */
/* ------------------------------------------------ */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Find the image to delete
    const imageToDelete = await prisma.postImage.findUnique({
      where: { id: imageId },
      include: { post: true }
    });

    if (!imageToDelete || imageToDelete.postId !== id) {
      return NextResponse.json(
        { error: "Image not found or doesn't belong to this post" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    if (imageToDelete.publicId) {
      await deleteContent(imageToDelete.publicId);
    }

    // Check if this was the cover image
    const wasCover = imageToDelete.isCover;

    // Delete the image from database
    await prisma.postImage.delete({
      where: { id: imageId }
    });

    // If deleted image was cover, assign a new cover if other images exist
    if (wasCover) {
      const remainingImages = await prisma.postImage.findMany({
        where: { postId: id },
        orderBy: { order: "asc" }
      });

      if (remainingImages.length > 0) {
        // Set the first remaining image as cover
        await prisma.postImage.update({
          where: { id: remainingImages[0].id },
          data: { isCover: true }
        });
      }
    }

    // Reorder remaining images
    const remainingImages = await prisma.postImage.findMany({
      where: { postId: id },
      orderBy: { order: "asc" }
    });

    await Promise.all(
      remainingImages.map((image, index) =>
        prisma.postImage.update({
          where: { id: image.id },
          data: { order: index }
        })
      )
    );

    // Return updated post with images
    const updatedPost = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        publicId: true,
        price: true,
        compareAtPrice: true,
        isDigital: true,
        createdAt: true,
        updatedAt: true,
        categoryId: true,
        subcategoryId: true,
        productTypeId: true,
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
        productType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const response = NextResponse.json(updatedPost);
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return response;

  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------ */
/* PATCH - Set image as cover or update order       */
/* ------------------------------------------------ */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { imageId, action } = body;

    if (!imageId || !action) {
      return NextResponse.json(
        { error: "Image ID and action are required" },
        { status: 400 }
      );
    }

    // Find the image
    const image = await prisma.postImage.findUnique({
      where: { id: imageId },
      include: { post: true }
    });

    if (!image || image.postId !== id) {
      return NextResponse.json(
        { error: "Image not found or doesn't belong to this post" },
        { status: 404 }
      );
    }

    if (action === "setCover") {
      // Remove cover from all images of this post
      await prisma.postImage.updateMany({
        where: { postId: id },
        data: { isCover: false }
      });

      // Set cover on selected image
      await prisma.postImage.update({
        where: { id: imageId },
        data: { isCover: true }
      });

    } else if (action === "reorder") {
      const { newOrder } = body;
      if (typeof newOrder !== "number") {
        return NextResponse.json(
          { error: "New order must be a number" },
          { status: 400 }
        );
      }

      // Get all images and update their order
      const allImages = await prisma.postImage.findMany({
        where: { postId: id },
        orderBy: { order: "asc" }
      });

      // Remove the image from current position
      const filteredImages = allImages.filter(img => img.id !== imageId);
      
      // Insert image at new position
      filteredImages.splice(newOrder, 0, image);

      // Update order for all images
      await Promise.all(
        filteredImages.map((img, index) =>
          prisma.postImage.update({
            where: { id: img.id },
            data: { order: index }
          })
        )
      );

    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'setCover' or 'reorder'" },
        { status: 400 }
      );
    }

    // Return updated post with images
    const updatedPost = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        publicId: true,
        price: true,
        compareAtPrice: true,
        isDigital: true,
        createdAt: true,
        updatedAt: true,
        categoryId: true,
        subcategoryId: true,
        productTypeId: true,
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
        productType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const response = NextResponse.json(updatedPost);
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return response;

  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}
