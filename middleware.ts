import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/projects",
    "/api/uploadthing",
  ]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};