import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

async function syncProfile() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized - please sign in first" }, { status: 401 });
    }

    console.log("Syncing user:", userId);
    console.log("User data:", user);

    // Get user details from Clerk
    const email = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    // Check if profile exists
    let profile = await db.profile.findFirst({
      where: { userId },
      include: { members: true }
    });

    if (!profile) {
      console.log("Creating new profile...");
      
      // Create profile
      profile = await db.profile.create({
        data: {
          userId,
          email,
          name: name || "User",
          imageUrl: user.imageUrl || null,
        },
        include: { members: true }
      });

      // Check how many total profiles exist to determine if this should be admin
      const totalProfiles = await db.profile.count();
      const shouldBeAdmin = totalProfiles === 1;

      // Create member record
      await db.member.create({
        data: {
          profileId: profile.id,
          provider: 'clerk',
          providerAccountId: userId,
          type: shouldBeAdmin ? 'ADMIN' : 'GUEST'
        }
      });

      console.log(`Created profile with role: ${shouldBeAdmin ? 'ADMIN' : 'GUEST'}`);
    } else {
      console.log("Updating existing profile...");
      
      // Update existing profile
      profile = await db.profile.update({
        where: { id: profile.id },
        data: {
          email,
          name: name || "User",
          imageUrl: user.imageUrl || null,
        },
        include: { members: true }
      });

      // If no member record exists, create one
      if (profile.members.length === 0) {
        const totalProfiles = await db.profile.count();
        const shouldBeAdmin = totalProfiles === 1;

        await db.member.create({
          data: {
            profileId: profile.id,
            provider: 'clerk',
            providerAccountId: userId,
            type: shouldBeAdmin ? 'ADMIN' : 'GUEST'
          }
        });

        console.log(`Created member record with role: ${shouldBeAdmin ? 'ADMIN' : 'GUEST'}`);
      }
    }

    // Refresh profile with members to get the latest data
    const updatedProfile = await db.profile.findFirst({
      where: { userId },
      include: { members: true }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Profile synced successfully",
      profile: {
        id: updatedProfile!.id,
        userId: updatedProfile!.userId,
        name: updatedProfile!.name,
        email: updatedProfile!.email,
        role: updatedProfile!.members[0]?.type || 'No role assigned'
      }
    });
  } catch (error) {
    console.error("[DEV_SYNC_PROFILE]", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// Export both GET and POST handlers
export const GET = syncProfile;
export const POST = syncProfile; 