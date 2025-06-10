import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the current user is an admin
    const currentUserProfile = await db.profile.findFirst({
      where: { userId: user.id },
      include: { members: true }
    });

    const isAdmin = currentUserProfile?.members.some(
      (member) => member.type === 'ADMIN'
    );

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { type } = body;

    // Update the member role
    const updatedMember = await db.member.update({
      where: { id },
      data: { type }
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Failed to update member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
} 