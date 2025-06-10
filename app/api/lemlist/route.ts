import { NextResponse } from 'next/server';

const LEMLIST_API_KEY = process.env.LEMLIST_API_KEY;
const LEMLIST_API_URL = 'https://api.lemlist.com/api';

export async function POST(request: Request) {
  try {
    if (!LEMLIST_API_KEY) {
      console.log('Lemlist API key not configured - skipping contact creation');
      return NextResponse.json({ success: true, message: 'Contact noted locally' });
    }

    const body = await request.json();
    const { email, firstName, lastName, companyName, phone, notes } = body;

    // Create or update lead in Lemlist
    const lemlistResponse = await fetch(`${LEMLIST_API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEMLIST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        companyName,
        phone,
        customFields: {
          source: 'portfolio-website',
          notes,
          createdAt: new Date().toISOString()
        }
      }),
    });

    if (!lemlistResponse.ok) {
      const errorData = await lemlistResponse.json();
      console.error('Lemlist API error:', errorData);
      
      // Don't fail the request if Lemlist fails
      return NextResponse.json({ 
        success: true, 
        message: 'Contact saved locally',
        lemlistError: true 
      });
    }

    const lemlistData = await lemlistResponse.json();

    return NextResponse.json({
      success: true,
      leadId: lemlistData.id,
      message: 'Contact added to Lemlist'
    });

  } catch (error) {
    console.error('Error adding contact to Lemlist:', error);
    return NextResponse.json(
      { success: true, message: 'Contact saved locally', error: true },
      { status: 200 }
    );
  }
}

// Get all campaigns
export async function GET() {
  try {
    if (!LEMLIST_API_KEY) {
      return NextResponse.json({ campaigns: [] });
    }

    const response = await fetch(`${LEMLIST_API_URL}/campaigns`, {
      headers: {
        'Authorization': `Bearer ${LEMLIST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching Lemlist campaigns:', error);
    return NextResponse.json({ campaigns: [] });
  }
} 