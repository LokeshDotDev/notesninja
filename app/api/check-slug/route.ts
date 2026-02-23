import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");
        const excludeId = searchParams.get("excludeId");

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        // Check if the slug exists in the Post model
        const existingPost = await prisma.post.findFirst({
            where: {
                slug: slug,
                NOT: excludeId ? { id: excludeId } : undefined,
            },
            select: { id: true },
        });

        if (existingPost) {
            return NextResponse.json({
                available: false,
                message: "This slug is already taken by another post.",
            });
        }

        // Also check categories just in case (optional, but good for uniqueness across types)
        const existingCategory = await prisma.category.findFirst({
            where: {
                slug: slug,
            },
            select: { id: true },
        });

        if (existingCategory) {
            return NextResponse.json({
                available: false,
                message: "This slug is already taken by a category.",
            });
        }

        return NextResponse.json({
            available: true,
            message: "Slug is available",
        });
    } catch (error) {
        console.error("Error checking slug availability:", error);
        return NextResponse.json(
            { error: "Failed to check slug availability" },
            { status: 500 },
        );
    }
}
