import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const personalInfo = await prisma.personalInfo.findUnique({
    where: { resumeId: resume.id },
  });

  return NextResponse.json(personalInfo);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const { fullName, email, phone, location, website, linkedin, summary } = await request.json();

  const personalInfo = await prisma.personalInfo.upsert({
    where: { resumeId: resume.id },
    update: { fullName, email, phone, location, website, linkedin, summary },
    create: { resumeId: resume.id, fullName, email, phone, location, website, linkedin, summary },
  });

  return NextResponse.json(personalInfo);
}
