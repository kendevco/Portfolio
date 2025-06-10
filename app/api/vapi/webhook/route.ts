import { NextResponse } from "next/server";
import { discordantClient } from "@/lib/discordant-client";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('VAPI Webhook received:', JSON.stringify(body, null, 2));

    const { type, call, transcript, summary } = body;

    switch (type) {
      case 'call-start':
        return handleCallStart(call);
      
      case 'transcript':
        return handleTranscript(call, transcript);
      
      case 'call-end':
        return handleCallEnd(call, summary);
      
      default:
        console.log(`Unhandled VAPI event type: ${type}`);
        return NextResponse.json({ success: true, message: 'Event logged' });
    }

  } catch (error) {
    console.error('VAPI Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCallStart(call: any) {
  try {
    console.log('VAPI Call Started:', call.id);

    // Create or update website visitor record
    const visitorData = {
      sessionId: call.id,
      name: call.customer?.name || null,
      email: call.customer?.email || null,
      ipAddress: call.metadata?.ipAddress || null,
      userAgent: call.metadata?.userAgent || null,
      isActive: true,
      lastSeen: new Date()
    };

    // Create visitor record
    await db.websiteVisitor.upsert({
      where: { sessionId: call.id },
      update: visitorData,
      create: visitorData
    });

    // Send notification to Discordant
    await discordantClient.sendSystemNotification(
      `🎙️ **VAPI Call Started**\n\nCall ID: ${call.id}\nCaller: ${call.customer?.name || 'Anonymous'}\n\nCall in progress...`,
      { vapiCallId: call.id, eventType: 'call-start' }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Call start processed',
      callId: call.id 
    });

  } catch (error) {
    console.error('Error handling call start:', error);
    return NextResponse.json(
      { error: 'Failed to process call start' },
      { status: 500 }
    );
  }
}

async function handleTranscript(call: any, transcript: any) {
  try {
    console.log('VAPI Transcript received for call:', call.id);

    // Update visitor record with transcript data
    await db.websiteVisitor.update({
      where: { sessionId: call.id },
      data: {
        lastSeen: new Date()
      }
    });

    // Create chat message record
    await db.chatMessage.create({
      data: {
        content: transcript.text || transcript.content || 'Voice transcript received',
        websiteVisitorId: call.id, // Using call.id as visitor ID for now
        isFromAI: transcript.role === 'assistant',
        metadata: {
          vapiCallId: call.id,
          transcriptType: transcript.role || 'user',
          timestamp: transcript.timestamp || new Date().toISOString(),
          confidence: transcript.confidence
        }
      }
    });

    // Only send significant transcript chunks to Discordant (not every word)
    if (transcript.text && transcript.text.length > 10) {
      await discordantClient.sendChatMessage({
        content: `**${transcript.role === 'assistant' ? '🤖 AI' : '👤 Caller'}:** ${transcript.text}`,
        sessionId: call.id,
        visitorName: call.customer?.name,
        visitorEmail: call.customer?.email,
        page: '/vapi-call'
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Transcript processed' 
    });

  } catch (error) {
    console.error('Error handling transcript:', error);
    return NextResponse.json(
      { error: 'Failed to process transcript' },
      { status: 500 }
    );
  }
}

async function handleCallEnd(call: any, summary: any) {
  try {
    console.log('VAPI Call Ended:', call.id);

    // Calculate call duration
    const visitor = await db.websiteVisitor.findUnique({
      where: { sessionId: call.id }
    });

    const startTime = visitor?.createdAt || new Date();
    const duration = Math.round((Date.now() - startTime.getTime()) / 1000);

    // Update visitor record
    await db.websiteVisitor.update({
      where: { sessionId: call.id },
      data: {
        isActive: false,
        lastSeen: new Date()
      }
    });

    // Get all messages for this call
    const callMessages = await db.chatMessage.findMany({
      where: { websiteVisitorId: call.id },
      orderBy: { createdAt: 'asc' }
    });

    const transcript = callMessages
      .map(msg => `${msg.isFromAI ? 'AI' : 'Caller'}: ${msg.content}`)
      .join('\n');

    // Send full call summary to Discordant (this will trigger n8n workflow)
    await discordantClient.sendVAPITranscript({
      sessionId: call.id,
      transcript: transcript || 'No transcript available',
      duration: duration,
      callerId: call.customer?.name || call.customer?.email || 'Anonymous',
      summary: summary?.text || summary?.content,
      actionItems: summary?.actionItems || []
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Call end processed',
      duration: duration,
      transcriptLength: transcript.length
    });

  } catch (error) {
    console.error('Error handling call end:', error);
    return NextResponse.json(
      { error: 'Failed to process call end' },
      { status: 500 }
    );
  }
}

// Handle VAPI verification if needed
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    status: 'VAPI webhook endpoint active',
    timestamp: new Date().toISOString()
  });
} 