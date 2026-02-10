import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET download link for purchased product
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const purchaseId = searchParams.get("purchaseId");
		const userEmail = searchParams.get("userEmail");

		if (!purchaseId || !userEmail) {
			return NextResponse.json(
				{ error: "Missing purchase ID or user email" },
				{ status: 400 }
			);
		}

		// Verify purchase exists and belongs to user
		const purchase = await prisma.purchase.findFirst({
			where: {
				id: purchaseId,
				userEmail,
				status: "completed"
			},
			include: {
				post: {
					include: {
						digitalFiles: true
					}
				}
			}
		});

		if (!purchase) {
			return NextResponse.json(
				{ error: "Purchase not found or not completed" },
				{ status: 404 }
			);
		}

		// Increment download count
		await prisma.purchase.update({
			where: { id: purchaseId },
			data: { downloadCount: { increment: 1 } }
		});

		// Return download links for all digital files
		const downloadLinks = purchase.post.digitalFiles.map(file => ({
			id: file.id,
			fileName: file.fileName,
			fileUrl: file.fileUrl,
			fileSize: file.fileSize,
			fileType: file.fileType,
			publicId: file.publicId
		}));

		return NextResponse.json({
			purchaseId: purchase.id,
			productTitle: purchase.post.title,
			downloadLinks,
			downloadCount: purchase.downloadCount + 1
		});

	} catch (error) {
		console.error("Error fetching download links:", error);
		return NextResponse.json(
			{ error: "Failed to fetch download links" },
			{ status: 500 }
		);
	}
}
