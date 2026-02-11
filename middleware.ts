import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (isAdminRoute(req)) {
		const session = await auth();
		if (!session.userId) {
			const signInUrl = new URL("/sign-in", req.url);
			return Response.redirect(signInUrl);
		}
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
