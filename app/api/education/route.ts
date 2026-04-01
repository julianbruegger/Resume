import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const education = await prisma.education.findMany({
    where: { resumeId: resume.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(education);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const body = await request.json();

  const count = await prisma.education.count({ where: { resumeId: resume.id } });

  const education = await prisma.education.create({
    data: {
      ...body,
      resumeId: resume.id,
      order: count + 1,
    },
  });

  return NextResponse.json(education, { status: 201 });
}
