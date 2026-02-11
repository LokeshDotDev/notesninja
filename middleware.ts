import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (isAdminRoute(req)) {
		const session = await auth();
		if (!session.userId) {
			return Response.redirect(new URL("/sign-in", req.url));
		}
	}
});
