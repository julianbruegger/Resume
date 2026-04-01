import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const volunteering = await prisma.volunteering.findMany({
    where: { resumeId: resume.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(volunteering);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const { organization, role, startDate, endDate, current, description } = await request.json();

  const count = await prisma.volunteering.count({ where: { resumeId: resume.id } });

  const volunteering = await prisma.volunteering.create({
    data: {
      organization,
      role,
      startDate,
      endDate,
      current,
      description,
      resumeId: resume.id,
      order: count + 1,
    },
  });

  return NextResponse.json(volunteering, { status: 201 });
}
