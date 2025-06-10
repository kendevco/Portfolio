import { NextResponse } from "next/server";
import { discordantClient } from "@/lib/discordant-client";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const member = await db.member.findFirst({
      where: {
        profile: { userId },
        type: "ADMIN"
      }
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const { action } = await req.json();

    switch (action) {
      case 'test-connection':
        return handleTestConnection();
      
      case 'create-agents':
        return handleCreateAgents();
      
      case 'send-test-message':
        return handleSendTestMessage();
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    console.error('Discordant setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function handleTestConnection() {
  try {
    // Test basic connection by sending a system notification
    const response = await discordantClient.sendSystemNotification(
      "🔧 **Portfolio Integration Test**\n\nDiscordant connection is working! Integration setup is ready.",
      { testType: 'connection-test', timestamp: new Date().toISOString() }
    );

    return NextResponse.json({
      success: true,
      message: "Connection test successful",
      response
    });

  } catch (error) {
    console.error('Connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: "Connection test failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function handleCreateAgents() {
  try {
    const results = await discordantClient.setupPortfolioAgents();
    
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: errorCount === 0,
      message: `Agent setup completed: ${successCount} created, ${errorCount} failed`,
      results
    });

  } catch (error) {
    console.error('Agent creation failed:', error);
    return NextResponse.json({
      success: false,
      error: "Agent creation failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function handleSendTestMessage() {
  try {
    // Send a test contact form message
    const testMessage = await discordantClient.sendContactFormMessage({
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message from the portfolio integration setup. The system is working correctly!",
      page: "/admin/setup",
      sessionId: `test-${Date.now()}`,
      userAgent: "Portfolio Setup Test"
    });

    return NextResponse.json({
      success: true,
      message: "Test message sent successfully",
      response: testMessage
    });

  } catch (error) {
    console.error('Test message failed:', error);
    return NextResponse.json({
      success: false,
      error: "Test message failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return setup status
    return NextResponse.json({
      status: "Discordant Integration Setup",
      timestamp: new Date().toISOString(),
      environment: {
        hasApiToken: !!process.env.DISCORDANT_API_TOKEN,
        hasBaseUrl: !!process.env.DISCORDANT_BASE_URL,
        hasPortfolioChannelId: !!process.env.DISCORDANT_PORTFOLIO_CHANNEL_ID,
        hasVapiChannelId: !!process.env.DISCORDANT_VAPI_CHANNEL_ID
      },
      actions: [
        'test-connection',
        'create-agents', 
        'send-test-message'
      ]
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get setup status', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 