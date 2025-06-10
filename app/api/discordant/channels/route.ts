import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return NextResponse.json({ error: "Server ID is required" }, { status: 400 });
    }

    const integration = await db.discordantIntegration.findFirst({
      where: { isActive: true }
    });

    if (!integration) {
      return NextResponse.json({ error: "No active Discordant integration found" }, { status: 404 });
    }

    // Fetch channels from Discordant API
    const response = await fetch(`${integration.discordantBaseUrl}/api/servers/${serverId}/channels`, {
      headers: {
        'Authorization': `Bearer ${integration.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Discordant API error: ${response.status}`);
    }

    const channels = await response.json();
    return NextResponse.json(channels);
  } catch (error) {
    console.error("[DISCORDANT_CHANNELS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 });
  }
} 