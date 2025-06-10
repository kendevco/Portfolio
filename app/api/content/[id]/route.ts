import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = await db.content.findUnique({
      where: { id }
    });

    if (!content) {
      return new NextResponse("Content not found", { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("[CONTENT_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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
    const { key, type, title, content, isPublished, metadata } = body;

    const updatedContent = await db.content.update({
      where: { id },
      data: {
        key,
        type,
        title,
        content,
        isPublished,
        metadata
      }
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("[CONTENT_ID_PUT]", error);
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
    await db.content.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CONTENT_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 