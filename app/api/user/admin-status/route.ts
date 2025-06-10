import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isUserAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false, isAuthenticated: false });
    }

    const isAdmin = await isUserAdmin(userId);
    
    return NextResponse.json({ 
      isAdmin, 
      isAuthenticated: true,
      userId 
    });
  } catch (error) {
    console.error("[USER_ADMIN_STATUS_GET]", error);
    return NextResponse.json({ isAdmin: false, isAuthenticated: false });
  }
} 