import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import {
  CloudinaryUploadResult,
  deleteContent,
  uploadContent,
} from "@/lib/Cloudinary";
import { calculateDiscountPercentage } from "@/lib/pricing-utils";

/* ------------------------------------------------ */
/* Helper: Types                                   */
/* ------------------------------------------------ */
interface PostUpdateData {
  title?: string;
  description?: string;
  slug?: string;
  categoryId?: string;
  price?: number;
  compareAtPrice?: number;
  imageUrl?: string;
  publicId?: string;
}

/* ------------------------------------------------ */
/* Helper: Find post by ID or Slug                 */
/* ------------------------------------------------ */
async function findPost(identifier: string) {
  return prisma.post.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    include: {
      images: true,
      digitalFiles: true,
      category: {
        include: {
          parent: true,
        },
      },
      subcategory: true,
      productType: true,
    },
  });
}

/* ------------------------------------------------ */
/* GET Single Post                                 */
/* ------------------------------------------------ */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await findPost(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Cache busting for main image
    if (post.imageUrl) {
      const cacheBuster = Math.random().toString(36).substring(7);
      post.imageUrl = `${post.imageUrl}?v=${cacheBuster}`;
    }

    const discountPercentage = calculateDiscountPercentage(
      post.price,
      post.compareAtPrice
    );

    const response = NextResponse.json({
      ...post,
      discountPercentage,
    });

    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );

    return response;
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------ */
/* PATCH Update Post                               */
/* ------------------------------------------------ */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingPost = await findPost(id);

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postId = existingPost.id;
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const slug = formData.get("slug") as string | null;
    const categoryId = formData.get("categoryId") as string | null;
    const price = formData.get("price") as string | null;
    const compareAtPrice = formData.get("compareAtPrice") as string | null;

    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const file = files.length > 0 ? files[0] : singleFile;

    const digitalFiles = formData.getAll("digitalFiles") as File[];

    const dataToUpdate: PostUpdateData = {};

    if (title) dataToUpdate.title = title;
    if (description) dataToUpdate.description = description;
    if (slug) dataToUpdate.slug = slug;
    if (categoryId) dataToUpdate.categoryId = categoryId;
    if (price) dataToUpdate.price = parseFloat(price);
    if (compareAtPrice)
      dataToUpdate.compareAtPrice = parseFloat(compareAtPrice);

    /* ---------- IMAGE UPDATE ---------- */
    if (file) {
      const existingImages = await prisma.postImage.findMany({
        where: { postId },
      });

      // Delete old main image
      if (existingPost.publicId) {
        await deleteContent(existingPost.publicId);
      }

      // Delete gallery images
      for (const img of existingImages) {
        if (img.publicId) {
          await deleteContent(img.publicId);
        }
      }

      const uploadResult = (await uploadContent(
        file
      )) as CloudinaryUploadResult;

      if (!uploadResult?.secure_url) {
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }

      dataToUpdate.imageUrl = uploadResult.secure_url;
      dataToUpdate.publicId = uploadResult.public_id;

      if (existingImages.length > 0) {
        await prisma.postImage.update({
          where: { id: existingImages[0].id },
          data: {
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          },
        });
      } else {
        await prisma.postImage.create({
          data: {
            postId,
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            order: 0,
          },
        });
      }
    }

    /* ---------- DIGITAL FILES UPDATE ---------- */
    if (digitalFiles.length > 0) {
      const existingDigitalFiles = await prisma.digitalFile.findMany({
        where: { postId },
      });

      for (const df of existingDigitalFiles) {
        if (df.publicId) {
          await deleteContent(df.publicId);
        }
      }

      await prisma.digitalFile.deleteMany({ where: { postId } });

      await Promise.all(
        digitalFiles.map(async (f) => {
          const result: CloudinaryUploadResult = await uploadContent(f, true);

          return prisma.digitalFile.create({
            data: {
              postId,
              fileName: f.name,
              fileUrl: result.secure_url,
              publicId: result.public_id,
              fileSize: f.size,
              fileType: f.type,
            },
          });
        })
      );
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided" },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: dataToUpdate,
    });

    if (dataToUpdate.imageUrl) {
      const cacheBuster = Math.random().toString(36).substring(7);
      updatedPost.imageUrl = `${dataToUpdate.imageUrl}?v=${cacheBuster}`;
    }

    const discountPercentage = calculateDiscountPercentage(
      updatedPost.price,
      updatedPost.compareAtPrice
    );

    const response = NextResponse.json({
      ...updatedPost,
      discountPercentage,
    });

    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );

    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------ */
/* DELETE Post                                     */
/* ------------------------------------------------ */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const post = await findPost(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const deletions = [];

    if (post.publicId) {
      deletions.push(deleteContent(post.publicId));
    }

    for (const img of post.images) {
      if (img.publicId) {
        deletions.push(deleteContent(img.publicId));
      }
    }

    for (const df of post.digitalFiles) {
      if (df.publicId) {
        deletions.push(deleteContent(df.publicId));
      }
    }

    await Promise.allSettled(deletions);

    await prisma.post.delete({
      where: { id: post.id },
    });

    const response = NextResponse.json({
      message: "Post deleted successfully",
    });

    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );

    return response;
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}