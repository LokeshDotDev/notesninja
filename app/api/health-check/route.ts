import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Health check endpoint to verify production environment
 * Visit /api/health-check in production to see configuration status
 */
export async function GET() {
	const checks = {
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
		checks: {
			cloudinary: {
				cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
				apiKey: !!process.env.CLOUDINARY_API_KEY,
				apiSecret: !!process.env.CLOUDINARY_API_SECRET,
				// Show partial values for verification (not full secrets)
				cloudNameValue: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.substring(0, 5) + "...",
				apiKeyValue: process.env.CLOUDINARY_API_KEY?.substring(0, 5) + "..."
			},
			database: {
				configured: !!process.env.DATABASE_URL,
				// Test connection
				connected: false
			},
			clerk: {
				configured: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY
			}
		}
	};

	// Test database connection
	try {
		await prisma.$queryRaw`SELECT 1`;
		checks.checks.database.connected = true;
	} catch (error) {
		checks.checks.database.connected = false;
		console.error("Database connection failed:", error);
	}

	// Overall status
	const allChecks = [
		checks.checks.cloudinary.cloudName,
		checks.checks.cloudinary.apiKey,
		checks.checks.cloudinary.apiSecret,
		checks.checks.database.configured,
		checks.checks.database.connected,
		checks.checks.clerk.configured
	];

	const status = allChecks.every(check => check) ? "healthy" : "unhealthy";

	return NextResponse.json({
		status,
		...checks
	}, {
		status: status === "healthy" ? 200 : 500
	});
}
