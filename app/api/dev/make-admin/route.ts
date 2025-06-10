import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create profile
    let profile = await db.profile.findFirst({
      where: { userId },
      include: { members: true }
    });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await db.profile.create({
        data: {
          userId,
          name: "Developer",
          email: "developer@example.com"
        },
        include: { members: true }
      });
    }

    // Create or update member record to ADMIN
    if (profile.members.length > 0) {
      await db.member.update({
        where: { id: profile.members[0].id },
        data: { type: "ADMIN" }
      });
    } else {
      await db.member.create({
        data: {
          profileId: profile.id,
          type: "ADMIN",
          provider: "clerk",
          providerAccountId: userId
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "User promoted to admin",
      userId,
      profileId: profile.id
    });
  } catch (error) {
    console.error("[DEV_MAKE_ADMIN]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 