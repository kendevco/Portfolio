import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const integrations = await db.discordantIntegration.findMany({
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json(integrations);
  } catch (error) {
    console.error("[DISCORDANT_INTEGRATIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const member = await db.member.findFirst({
      where: {
        profile: {
          userId: userId
        },
        type: "ADMIN"
      }
    });

    if (!member) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { 
      discordantBaseUrl, 
      apiToken, 
      serverId, 
      serverName, 
      channelId, 
      channelName, 
      isActive 
    } = body;

    // If this is being set as active, deactivate others
    if (isActive) {
      await db.discordantIntegration.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
    }

    const integration = await db.discordantIntegration.create({
      data: {
        discordantBaseUrl,
        apiToken,
        serverId,
        serverName,
        channelId,
        channelName,
        isActive
      }
    });

    return NextResponse.json(integration);
  } catch (error) {
    console.error("[DISCORDANT_INTEGRATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 