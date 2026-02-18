import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { 
            userId: null,
            userEmail: session.user.email || ''
          }
        ]
      },
      include: {
        post: {
          include: {
            digitalFiles: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(purchases);

  } catch (error) {
    console.error("Failed to fetch user purchases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
