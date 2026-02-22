import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import {
    CloudinaryUploadResult,
    deleteContent,
    uploadContent,
} from "@/lib/Cloudinary";

// Helper to find post by ID or Slug
async function findPost(identifier: string) {
    // First try findUnique by ID
    let post = await prisma.post.findUnique({
        where: { id: identifier },
        include: {
            images: {
                select: {
                    id: true,
                    imageUrl: true,
                    publicId: true,
                    order: true,
                },
            },
            digitalFiles: {
                select: {
                    id: true,
                    fileName: true,
                    fileUrl: true,
                    publicId: true,
                    fileSize: true,
                    fileType: true,
                    postId: true,
                    createdAt: true,
                },
            },
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
            productType: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    // If not found by ID, try findFirst by Slug
    if (!post) {
        post = await prisma.post.findFirst({
            where: { slug: identifier },
            include: {
                images: {
                    select: {
                        id: true,
                        imageUrl: true,
                        publicId: true,
                        order: true,
                    },
                },
                digitalFiles: {
                    select: {
                        id: true,
                        fileName: true,
                        fileUrl: true,
                        publicId: true,
                        fileSize: true,
                        fileType: true,
                        postId: true,
                        createdAt: true,
                    },
                },
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
                productType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    return post;
}

// GET Single Post
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ identifier: string }> },
) {
    try {
        const { identifier } = await params;
        const post = await findPost(identifier);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Add cache-busting timestamp to imageUrl if it exists
        if (post.imageUrl) {
            const cacheBuster = Math.random().toString(36).substring(7);
            post.imageUrl = `${post.imageUrl}?v=${cacheBuster}`;
        }

        const response = NextResponse.json(post);
        response.headers.set(
            "Cache-Control",
            "no-cache, no-store, must-revalidate",
        );
        return response;
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 },
        );
    }
}

// UPDATE Post
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ identifier: string }> },
) {
    const session = await getSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { identifier } = await params;
        const existingPost = await findPost(identifier);

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const postId = existingPost.id;
        const formData = await req.formData();
        const title = formData.get("title") as string | null;
        const description = formData.get("description") as string | null;
        const slug = formData.get("slug") as string | null;
        const categoryId = formData.get("categoryId") as string | null;
        const files = formData.getAll("files") as File[];
        const singleFile = formData.get("file") as File | null;
        const file = files.length > 0 ? files[0] : singleFile;
        const digitalFiles = formData.getAll("digitalFiles") as File[];

        const dataToUpdate: any = {};
        if (title) dataToUpdate.title = title;
        if (description) dataToUpdate.description = description;
        if (slug) dataToUpdate.slug = slug;
        if (categoryId) dataToUpdate.categoryId = categoryId;

        // Handle Image Update
        if (file) {
            console.log("🔄 Image update process started");

            const existingImages = await prisma.postImage.findMany({
                where: { postId },
            });

            if (existingPost.publicId) {
                await deleteContent(existingPost.publicId);
            }

            for (const image of existingImages) {
                if (image.publicId) {
                    await deleteContent(image.publicId);
                }
            }

            const uploadResult = (await uploadContent(file)) as CloudinaryUploadResult;

            if (!uploadResult?.secure_url) {
                return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
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
                        imageUrl: uploadResult.secure_url,
                        publicId: uploadResult.public_id,
                        order: 0,
                        postId,
                    },
                });
            }
        }

        // Handle Digital Files Update
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

            const filePromises = digitalFiles.map(async (f) => {
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
            });

            await Promise.all(filePromises);
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: dataToUpdate,
        });

        if (dataToUpdate.imageUrl) {
            const cacheBuster = Math.random().toString(36).substring(7);
            updatedPost.imageUrl = `${dataToUpdate.imageUrl}?v=${cacheBuster}`;
        }

        const response = NextResponse.json(updatedPost);
        response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
        return response;
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

// DELETE Post
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ identifier: string }> },
) {
    const session = await getSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { identifier } = await params;
        const post = await findPost(identifier);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const cloudinaryDeletions = [];
        if (post.publicId) cloudinaryDeletions.push(deleteContent(post.publicId));

        for (const img of post.images) {
            if (img.publicId) cloudinaryDeletions.push(deleteContent(img.publicId));
        }

        for (const df of post.digitalFiles) {
            if (df.publicId) cloudinaryDeletions.push(deleteContent(df.publicId));
        }

        await Promise.allSettled(cloudinaryDeletions);
        await prisma.post.delete({ where: { id: post.id } });

        const response = NextResponse.json({ message: "Post deleted successfully" });
        response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
        return response;
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
