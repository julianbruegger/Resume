import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  const { id } = await params;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing || existing.resumeId !== resume.id) {
    return NextResponse.json({ error: "Experience entry not found" }, { status: 404 });
  }

  const body = await request.json();
  const updated = await prisma.experience.update({ where: { id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  const { id } = await params;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing || existing.resumeId !== resume.id) {
    return NextResponse.json({ error: "Experience entry not found" }, { status: 404 });
  }

  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
