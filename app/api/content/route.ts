import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const type = searchParams.get("type");

    if (key) {
      const content = await db.content.findUnique({
        where: { key }
      });
      return NextResponse.json(content);
    }

    const whereClause: any = {};
    if (type) {
      whereClause.type = type;
    }

    const contents = await db.content.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("[CONTENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { key, type, title, content, isPublished, metadata } = body;

    const newContent = await db.content.create({
      data: {
        key,
        type,
        title,
        content,
        isPublished,
        metadata
      }
    });

    return NextResponse.json(newContent);
  } catch (error) {
    console.error("[CONTENT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 