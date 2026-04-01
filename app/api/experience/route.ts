import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const experience = await prisma.experience.findMany({
    where: { resumeId: resume.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(experience);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const { company, title, location, startDate, endDate, current, description } =
    await request.json();

  const count = await prisma.experience.count({ where: { resumeId: resume.id } });

  const experience = await prisma.experience.create({
    data: {
      company,
      title,
      location,
      startDate,
      endDate,
      current,
      description,
      resumeId: resume.id,
      order: count + 1,
    },
  });

  return NextResponse.json(experience, { status: 201 });
}
