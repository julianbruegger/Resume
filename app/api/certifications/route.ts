import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const certifications = await prisma.certification.findMany({
    where: { resumeId: resume.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(certifications);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const resume = await prisma.resume.findUnique({ where: { userId } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const { name, issuer, issueDate, expiryDate, credentialId, url } = await request.json();

  const count = await prisma.certification.count({ where: { resumeId: resume.id } });

  const certification = await prisma.certification.create({
    data: {
      name,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      url,
      resumeId: resume.id,
      order: count + 1,
    },
  });

  return NextResponse.json(certification, { status: 201 });
}
