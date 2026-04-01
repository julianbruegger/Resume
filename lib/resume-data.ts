import { prisma } from "@/lib/prisma";
import type { ResumeData } from "@/types/resume";

export async function getResumeData(userId: string): Promise<ResumeData | null> {
  const resume = await prisma.resume.findUnique({
    where: { userId },
    include: {
      personal: true,
      education: { orderBy: { order: "asc" } },
      experience: { orderBy: { order: "asc" } },
      certs: { orderBy: { order: "asc" } },
      volunteering: { orderBy: { order: "asc" } },
    },
  });

  if (!resume) return null;

  return {
    template: resume.template,
    personal: resume.personal,
    education: resume.education,
    experience: resume.experience,
    certs: resume.certs,
    volunteering: resume.volunteering,
  };
}
