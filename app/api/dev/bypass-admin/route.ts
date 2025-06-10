import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "http://localhost:3000"));
    }

    // Quick admin check
    const member = await db.member.findFirst({
      where: {
        profile: {
          userId: userId
        },
        type: "ADMIN"
      }
    });

    if (!member) {
      return NextResponse.json({ 
        error: "Not an admin",
        userId,
        message: "You don't have admin privileges"
      }, { status: 403 });
    }

    // Redirect to admin with a simple HTML page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admin Access Confirmed</title>
          <meta http-equiv="refresh" content="2; url=/admin">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
          <h1>✅ Admin Access Confirmed!</h1>
          <p>User ID: ${userId}</p>
          <p>Admin privileges verified in database.</p>
          <p>Redirecting to admin dashboard in 2 seconds...</p>
          <p><a href="/admin">Click here if not redirected automatically</a></p>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

  } catch (error) {
    console.error("[BYPASS_ADMIN]", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 