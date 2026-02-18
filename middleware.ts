import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { isAdmin } from "./lib/admin";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // CRITICAL: Allow ACME challenges to pass through without any interference
  // This prevents SSL certificate verification failures
  if (pathname.startsWith("/.well-known/acme-challenge/")) {
    return NextResponse.next();
  }

  // Also allow any other .well-known requests for security and verification
  if (pathname.startsWith("/.well-known/")) {
    return NextResponse.next();
  }

  // Allow HTML verification file to be served directly
  if (pathname === "/udfqcfua9mzrfa6zp5jath0qx5skal.html") {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    // Check if user email is in admin list
    if (!isAdmin(token.email || undefined)) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect old product URLs to new SEO-friendly URLs
  if (pathname.startsWith("/product/") && pathname.split("/").length === 3) {
    const productId = pathname.split("/")[2];
    if (productId) {
      const url = req.nextUrl.clone();
      url.pathname = `/api/redirect-product/${productId}`;
      url.searchParams.set("from", pathname);
      return NextResponse.rewrite(url);
    }
  }

  // Handle incomplete product URLs (catch-all route priority issue)
  const pathSegments = pathname.split("/").filter(Boolean);
  if (pathSegments.length >= 2 && !pathname.startsWith("/checkout/")) {
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Check if the last segment looks like a product ID (cuid pattern)
    if (lastSegment && lastSegment.startsWith('c') && lastSegment.length === 25) {
      // Only redirect if this looks like an incomplete URL
      // Complete SEO URLs should have at least 3 segments before the product ID
      if (pathSegments.length < 4) {
        // This looks like an incomplete product URL, rewrite to redirect API
        const url = req.nextUrl.clone();
        url.pathname = `/api/redirect-product/${lastSegment}`;
        url.searchParams.set("from", pathname);
        return NextResponse.rewrite(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap|\\.well-known|robots.txt).*)"],
};
