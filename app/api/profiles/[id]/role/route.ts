import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure the user is an admin
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    if (!role || !["ADMIN", "MODERATOR", "GUEST"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Find the profile
    const profile = await db.profile.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update or create member record
    let member;
    if (profile.members.length > 0) {
      // Update existing member
      member = await db.member.update({
        where: { id: profile.members[0].id },
        data: { type: role }
      });
    } else {
      // Create new member record
      member = await db.member.create({
        data: {
          profileId: profile.id,
          type: role,
          provider: "clerk",
          providerAccountId: profile.userId
        }
      });
    }

    // Return updated profile with member info
    const updatedProfile = await db.profile.findUnique({
      where: { id },
      include: { members: true }
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[PROFILE_ROLE_PUT]", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized") || error.message.includes("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 