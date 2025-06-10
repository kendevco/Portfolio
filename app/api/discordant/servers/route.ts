import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const integration = await db.discordantIntegration.findFirst({
      where: { isActive: true }
    });

    if (!integration) {
      return NextResponse.json({ error: "No active Discordant integration found" }, { status: 404 });
    }

    // Fetch servers from Discordant API
    const response = await fetch(`${integration.discordantBaseUrl}/api/servers`, {
      headers: {
        'Authorization': `Bearer ${integration.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Discordant API error: ${response.status}`);
    }

    const servers = await response.json();
    return NextResponse.json(servers);
  } catch (error) {
    console.error("[DISCORDANT_SERVERS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 });
  }
} 