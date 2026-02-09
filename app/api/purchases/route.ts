import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPurchaseConfirmationEmail } from "@/app/api/email/route";

// GET all purchases (admin only)
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const userEmail = searchParams.get("userEmail");
		const postId = searchParams.get("postId");

		const where = userEmail 
			? { userEmail } 
			: postId 
			? { postId }
			: {};

		const purchases = await prisma.purchase.findMany({
			where,
			include: {
				post: {
					include: {
						category: {
							select: { id: true, name: true }
						},
						digitalFiles: true
					}
				}
			},
			orderBy: { createdAt: "desc" }
		});

		return NextResponse.json(purchases);
	} catch (error) {
		console.error("Error fetching purchases:", error);
		return NextResponse.json(
			{ error: "Failed to fetch purchases" },
			{ status: 500 }
		);
	}
}

// POST create new purchase
export async function POST(req: NextRequest) {
	try {
		const { postId, userEmail, amount, paymentId } = await req.json();

		if (!postId || !userEmail || !amount) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Check if user already purchased this product
		const existingPurchase = await prisma.purchase.findFirst({
			where: {
				postId,
				userEmail,
				status: "completed"
			}
		});

		if (existingPurchase) {
			return NextResponse.json(
				{ error: "Product already purchased" },
				{ status: 400 }
			);
		}

		// Create purchase record
		const purchase = await prisma.purchase.create({
			data: {
				postId,
				userEmail,
				amount,
				paymentId,
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

		// Send purchase confirmation email for digital products
		if (purchase.post.isDigital && purchase.post.digitalFiles.length > 0) {
			try {
				const downloadLinks = purchase.post.digitalFiles.map(file => ({
					fileName: file.fileName,
					fileUrl: file.fileUrl
				}));

				await sendPurchaseConfirmationEmail(
					userEmail,
					purchase.post.title,
					purchase.id,
					downloadLinks
				);
				
				console.log(`Purchase confirmation email sent to ${userEmail}`);
			} catch (emailError) {
				console.error("Failed to send purchase confirmation email:", emailError);
				// Don't fail the purchase if email fails
			}
		}

		return NextResponse.json(purchase, { status: 201 });
	} catch (error) {
		console.error("Error creating purchase:", error);
		return NextResponse.json(
			{ error: "Failed to create purchase" },
			{ status: 500 }
		);
	}
}
