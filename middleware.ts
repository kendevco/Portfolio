import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Make all routes public since admin functionality is not implemented yet
  publicRoutes: [
    "/(.*)",
  ],
  // Ignore static files and Next.js internals
  ignoredRoutes: [
    "/((?!api|trpc))(_next.*|.+\\.[\w]+$)",
    "/favicon.ico",
  ]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};