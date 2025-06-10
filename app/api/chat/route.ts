import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    const body = await request.json();
    const { message, timestamp } = body;

    // Get user profile if authenticated
    let userProfile = null;
    if (user) {
      userProfile = await db.profile.findFirst({
        where: { userId: user.id },
        include: { members: true }
      });
    }

    // Prepare the payload for n8n
    const n8nPayload = {
      message,
      timestamp,
      user: {
        id: user?.id || 'anonymous',
        name: userProfile?.name || user?.firstName || 'Anonymous',
        email: userProfile?.email || user?.emailAddresses?.[0]?.emailAddress || null,
        imageUrl: userProfile?.imageUrl || user?.imageUrl || null,
      },
      source: 'portfolio-website',
      channel: 'web-chat'
    };

    // Add to Lemlist if we have user email
    if (n8nPayload.user.email) {
      try {
        await fetch('/api/lemlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: n8nPayload.user.email,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            notes: `First message: ${message}`,
          }),
        });
      } catch (lemlistError) {
        console.error('Failed to add to Lemlist:', lemlistError);
        // Don't fail the chat if Lemlist fails
      }
    }

    // Call n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.error('N8N webhook URL not configured');
      return NextResponse.json(
        { response: "I'm currently unable to forward your message, but I've noted your request. Please try again later." },
        { status: 200 }
      );
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.statusText}`);
    }

    const n8nData = await n8nResponse.json();

    // Save conversation to database (optional)
    if (user && userProfile) {
      // You could create a Conversation model to track chats
      // For now, we'll just return the response
    }

    return NextResponse.json({
      response: n8nData.response || "Your message has been received. The team will respond through Discord shortly.",
      sessionId: n8nData.sessionId,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { response: "Sorry, I encountered an error. Please try again later." },
      { status: 200 } // Return 200 to avoid error in frontend
    );
  }
} 