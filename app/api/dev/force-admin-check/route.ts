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
      return NextResponse.json({ 
        error: "Not authenticated",
        userId: null,
        hasAuth: false
      });
    }

    // Direct database check
    const profile = await db.profile.findFirst({
      where: { userId },
      include: { members: true }
    });

    if (!profile) {
      return NextResponse.json({
        error: "No profile found",
        userId,
        hasAuth: true,
        hasProfile: false
      });
    }

    const adminMember = profile.members.find(m => m.type === "ADMIN");

    return NextResponse.json({
      userId,
      hasAuth: true,
      hasProfile: true,
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email
      },
      members: profile.members.map(m => ({
        id: m.id,
        type: m.type,
        provider: m.provider
      })),
      isAdmin: !!adminMember,
      adminMember: adminMember || null
    });
  } catch (error) {
    console.error("[FORCE_ADMIN_CHECK]", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 