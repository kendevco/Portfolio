import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    return NextResponse.json({
      auth: {
        userId,
        hasUserId: !!userId
      },
      user: user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddresses: user.emailAddresses.map(email => ({
          id: email.id,
          emailAddress: email.emailAddress
        })),
        primaryEmailAddressId: user.primaryEmailAddressId,
        imageUrl: user.imageUrl
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[DEBUG_USER]", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 