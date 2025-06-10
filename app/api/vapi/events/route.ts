import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    // Ensure the user is an admin
    await requireAdmin();

    const events = await db.vapiEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 100 // Limit to last 100 events
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[VAPI_EVENTS_GET]", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized") || error.message.includes("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 