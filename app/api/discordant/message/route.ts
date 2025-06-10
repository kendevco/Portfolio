import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, serverId, channelId, sessionId, visitorInfo } = body;

    if (!message || !serverId || !channelId || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const integration = await db.discordantIntegration.findFirst({
      where: { isActive: true }
    });

    if (!integration) {
      return NextResponse.json({ error: "No active Discordant integration found" }, { status: 404 });
    }

    // Find or create website visitor
    let visitor = await db.websiteVisitor.findUnique({
      where: { sessionId }
    });

    if (!visitor) {
      visitor = await db.websiteVisitor.create({
        data: {
          sessionId,
          name: visitorInfo?.name || "Website Visitor",
          email: visitorInfo?.email,
          ipAddress: visitorInfo?.ipAddress,
          userAgent: visitorInfo?.userAgent
        }
      });

      // Create user in Discordant
      const discordantUserResponse = await fetch(`${integration.discordantBaseUrl}/api/website-visitors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          name: visitor.name,
          email: visitor.email,
          serverId
        })
      });

      if (discordantUserResponse.ok) {
        const discordantUser = await discordantUserResponse.json();
        await db.websiteVisitor.update({
          where: { id: visitor.id },
          data: { discordantUserId: discordantUser.id }
        });
      }
    } else {
      // Update last seen
      await db.websiteVisitor.update({
        where: { id: visitor.id },
        data: { lastSeen: new Date() }
      });
    }

    // Send message to Discordant
    const discordantMessageResponse = await fetch(`${integration.discordantBaseUrl}/api/servers/${serverId}/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integration.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: message,
        userId: visitor.discordantUserId,
        metadata: {
          source: "website_chat",
          sessionId,
          timestamp: new Date().toISOString()
        }
      })
    });

    let discordantMessage = null;
    if (discordantMessageResponse.ok) {
      discordantMessage = await discordantMessageResponse.json();
    }

    // Save message to our database
    const chatMessage = await db.chatMessage.create({
      data: {
        content: message,
        websiteVisitorId: visitor.id,
        discordantMessageId: discordantMessage?.id,
        metadata: {
          serverId,
          channelId,
          source: "website"
        }
      }
    });

    // Trigger n8n workflow if configured
    let n8nResponse = null;
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        const n8nPayload = {
          message,
          sessionId,
          visitor: {
            id: visitor.id,
            name: visitor.name,
            email: visitor.email
          },
          discordant: {
            serverId,
            channelId,
            messageId: discordantMessage?.id
          },
          metadata: {
            source: "portfolio_website",
            timestamp: new Date().toISOString()
          }
        };

        n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n8nPayload)
        });

        if (n8nResponse.ok) {
          const n8nResult = await n8nResponse.json();
          await db.chatMessage.update({
            where: { id: chatMessage.id },
            data: {
              n8nWorkflowId: n8nResult.workflowId,
              n8nExecutionId: n8nResult.executionId
            }
          });
        }
      } catch (n8nError) {
        console.error("N8N webhook error:", n8nError);
      }
    }

    return NextResponse.json({
      success: true,
      message: chatMessage,
      discordantMessage,
      n8nTriggered: n8nResponse?.ok || false
    });
  } catch (error) {
    console.error("[DISCORDANT_MESSAGE_POST]", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
} 