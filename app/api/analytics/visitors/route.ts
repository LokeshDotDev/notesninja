import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all visitors
export async function GET() {
	try {
		const visitors = await prisma.visitor.findMany({
			orderBy: { visitedAt: "desc" },
		});
		return NextResponse.json(visitors);
	} catch (error) {
		console.error("Error fetching visitors:", error);
		return NextResponse.json(
			{ error: "Failed to fetch visitor data" },
			{ status: 500 }
		);
	}
}

// POST: Log a new visitor
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { ipAddress, location } = body;

		if (!ipAddress || !location) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const visitor = await prisma.visitor.create({
			data: {
				ipAddress,
				location,
			},
		});

		return NextResponse.json(visitor, { status: 201 });
	} catch (error) {
		console.error("Error logging visitor:", error);
		return NextResponse.json(
			{ error: "Failed to log visitor" },
			{ status: 500 }
		);
	}
}
