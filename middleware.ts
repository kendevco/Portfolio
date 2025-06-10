import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook",
  "/api/webhook/clerk", 
  "/api/uploadthing",
  "/api/chat",
  "/api/lemlist",
  "/api/content(.*)",
  "/api/discordant(.*)",
  "/((?!api|_next|admin).*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Handle admin routes
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    
    if (!userId) {
      // Redirect to sign-in for admin routes
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Admin check will be handled by the AdminLayout component
    // This middleware just ensures they're signed in for admin routes
  }
  
  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};