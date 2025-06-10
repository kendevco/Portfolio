import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isUserAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const skills = await db.skill.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("[SKILLS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, category, level, icon, description } = await req.json();

    if (!name || !category || level === undefined || !icon) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const skill = await db.skill.create({
      data: {
        name,
        category,
        level: parseInt(level),
        icon,
        description: description || null
      }
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("[SKILLS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 