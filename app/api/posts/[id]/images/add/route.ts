import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import { uploadContent, CloudinaryUploadResult } from "@/lib/Cloudinary";

/* ------------------------------------------------ */
/* POST - Add new images to existing post          */
/* ------------------------------------------------ */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formData = await req.formData();

    // Handle both multiple files and single file
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Upload images and create records
    const startingOrder = post.images.length;
    const coverImageIndex = parseInt(formData.get("coverImageIndex") as string) || 0;

    const imagePromises = allFiles.map(async (file, index) => {
      console.log(`Uploading image ${index + 1}: ${file.name}`);
      const uploadResult: CloudinaryUploadResult = await uploadContent(file);

      return prisma.postImage.create({
        data: {
          postId: id,
          imageUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          order: startingOrder + index,
          isCover: post.images.length === 0 && index === coverImageIndex, // Only set cover if no images exist
        },
      });
    });

    await Promise.all(imagePromises);

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
    console.error("Error adding images:", error);
    return NextResponse.json(
      { error: "Failed to add images" },
      { status: 500 }
    );
  }
}
