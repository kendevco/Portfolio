import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
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
        where: { 
          isActive: true,
          id: { not: id }
        },
        data: { isActive: false }
      });
    }

    const integration = await db.discordantIntegration.update({
      where: { id },
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
    console.error("[DISCORDANT_INTEGRATION_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await db.discordantIntegration.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DISCORDANT_INTEGRATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 