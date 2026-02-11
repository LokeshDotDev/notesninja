import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (isAdminRoute(req)) {
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap).*)"],
};
