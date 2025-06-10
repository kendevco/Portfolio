import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure the user is an admin
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();
    const { processed } = body;

    const updatedEvent = await db.vapiEvent.update({
      where: { id },
      data: { processed }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("[VAPI_EVENT_PATCH]", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized") || error.message.includes("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 