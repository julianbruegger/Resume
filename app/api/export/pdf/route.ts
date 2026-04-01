import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResumeData } from "@/lib/resume-data";
import { generatePdf } from "@/lib/export/generate-pdf";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getResumeData(session.user.id);
  if (!data) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const buffer = await generatePdf(data);

  const name = data.personal?.fullName?.replace(/\s+/g, "_") || "resume";
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}_resume.pdf"`,
    },
  });
}
