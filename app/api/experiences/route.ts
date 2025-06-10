import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const experiences = await db.experience.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Failed to fetch experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, location, description, icon, date } = body;

    const experience = await db.experience.create({
      data: {
        title,
        location,
        description,
        icon: icon || '🏢',
        date,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Failed to create experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
} 