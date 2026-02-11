import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function middleware(req: NextRequest) {
	// Skip middleware for API routes, static files, and Next.js internals
	if (
		req.nextUrl.pathname.startsWith("/api/") ||
		req.nextUrl.pathname.startsWith("/_next/") ||
		req.nextUrl.pathname.startsWith("/favicon.ico") ||
		req.nextUrl.pathname.startsWith("/sitemap")
	) {
		return NextResponse.next();
	}

	// Protect admin routes
	if (req.nextUrl.pathname.startsWith("/admin")) {
		const { userId } = await auth();
		
		if (!userId) {
			const signInUrl = new URL("/sign-in", req.url);
			return NextResponse.redirect(signInUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap).*)"],
};
