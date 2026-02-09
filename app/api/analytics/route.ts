import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
	try {
		const { ipAddress, location } = await req.json();
		if (!ipAddress || !location) {
			return NextResponse.json({ error: "Missing data" }, { status: 400 });
		}
		// Check if visitor already exists
		const existing = await prisma.visitor.findUnique({
			where: { ipAddress: ipAddress },
		});
		if (existing) {
			return NextResponse.json({ success: true, alreadyExists: true });
		}
		await prisma.visitor.create({
			data: {
				ipAddress,
				location,
			},
		});
		return NextResponse.json({ success: true });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}

export async function GET() {
	try {
		const visitors = await prisma.visitor.findMany({
			orderBy: { visitedAt: "desc" },
			take: 1000,
		});
		return NextResponse.json(visitors);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
