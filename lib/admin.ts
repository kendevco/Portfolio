import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function isUserAdmin(userId?: string): Promise<boolean> {
  try {
    const userIdToCheck = userId || (await auth()).userId;
    if (!userIdToCheck) return false;

    const member = await db.member.findFirst({
      where: {
        profile: {
          userId: userIdToCheck
        },
        type: "ADMIN"
      }
    });

    return !!member;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function requireAdmin() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized: Please sign in");
  }

  const isAdmin = await isUserAdmin(userId);
  if (!isAdmin) {
    throw new Error("Forbidden: Admin access required");
  }

  return userId;
} 