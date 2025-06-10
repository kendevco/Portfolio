import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Testing Discordant connection...');
    console.log('API Token:', process.env.DISCORDANT_API_TOKEN ? 'Present' : 'Missing');
    console.log('Base URL:', process.env.DISCORDANT_BASE_URL);
    console.log('Channel ID:', process.env.DISCORDANT_PORTFOLIO_CHANNEL_ID);
    
    const response = await fetch(`${process.env.DISCORDANT_BASE_URL}/api/external/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DISCORDANT_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channelId: process.env.DISCORDANT_PORTFOLIO_CHANNEL_ID,
        content: body.message || 'Test message from portfolio',
        sourceType: 'portfolio-test',
        visitorData: {
          sessionId: `test-${Date.now()}`,
          metadata: {
            testMessage: true,
            timestamp: new Date().toISOString()
          }
        }
      })
    });

    console.log('Discordant response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discordant error:', errorText);
      throw new Error(`Discordant API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Discordant success:', result);
    
    return NextResponse.json({ 
      success: true, 
      result,
      message: 'Message sent to Discordant successfully!'
    });
    
  } catch (error) {
    console.error('Test Discordant error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Discordant Test Endpoint',
    environment: {
      hasApiToken: !!process.env.DISCORDANT_API_TOKEN,
      hasBaseUrl: !!process.env.DISCORDANT_BASE_URL,
      hasChannelId: !!process.env.DISCORDANT_PORTFOLIO_CHANNEL_ID,
      baseUrl: process.env.DISCORDANT_BASE_URL,
      channelId: process.env.DISCORDANT_PORTFOLIO_CHANNEL_ID
    },
    timestamp: new Date().toISOString()
  });
} 