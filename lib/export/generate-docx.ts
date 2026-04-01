import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ShadingType,
} from "docx";
import type { ResumeData } from "@/types/resume";

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333" },
    },
  });
}

function dateRange(start?: string | null, end?: string | null, current?: boolean): string {
  const s = start || "";
  const e = current ? "Present" : end || "";
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

export async function generateDocx(data: ResumeData): Promise<Buffer> {
  const paragraphs: Paragraph[] = [];

  // Header
  if (data.personal) {
    const p = data.personal;
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: p.fullName || "Your Name", bold: true, size: 48 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );

    const contactParts = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean);
    if (contactParts.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: contactParts.join("  |  "), size: 20, color: "555555" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );
    }

    if (p.summary) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: p.summary, size: 22 })],
          spacing: { after: 200 },
        })
      );
    }
  }

  // Experience
  if (data.experience.length > 0) {
    paragraphs.push(sectionHeading("Work Experience"));
    for (const exp of data.experience) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true, size: 24 }),
            new TextRun({ text: `  –  ${exp.company}`, size: 24 }),
          ],
          spacing: { before: 160, after: 40 },
        })
      );
      const meta = [exp.location, dateRange(exp.startDate, exp.endDate, exp.current)].filter(Boolean).join("  |  ");
      if (meta) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: meta, italics: true, size: 20, color: "666666" })],
            spacing: { after: 60 },
          })
        );
      }
      if (exp.description) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: exp.description, size: 22 })],
            spacing: { after: 100 },
          })
        );
      }
    }
  }

  // Education
  if (data.education.length > 0) {
    paragraphs.push(sectionHeading("Education"));
    for (const edu of data.education) {
      const degreeField = [edu.degree, edu.field].filter(Boolean).join(" in ");
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.school, bold: true, size: 24 }),
            ...(degreeField ? [new TextRun({ text: `  –  ${degreeField}`, size: 24 })] : []),
          ],
          spacing: { before: 160, after: 40 },
        })
      );
      const meta = [
        dateRange(edu.startDate, edu.endDate, edu.current),
        edu.gpa ? `GPA: ${edu.gpa}` : null,
      ].filter(Boolean).join("  |  ");
      if (meta) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: meta, italics: true, size: 20, color: "666666" })],
            spacing: { after: 60 },
          })
        );
      }
      if (edu.description) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: edu.description, size: 22 })],
            spacing: { after: 100 },
          })
        );
      }
    }
  }

  // Certifications
  if (data.certs.length > 0) {
    paragraphs.push(sectionHeading("Certifications"));
    for (const cert of data.certs) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 24 }),
            ...(cert.issuer ? [new TextRun({ text: `  –  ${cert.issuer}`, size: 24 })] : []),
          ],
          spacing: { before: 160, after: 40 },
        })
      );
      const meta = [cert.issueDate, cert.expiryDate ? `Expires: ${cert.expiryDate}` : null].filter(Boolean).join("  |  ");
      if (meta) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: meta, italics: true, size: 20, color: "666666" })],
            spacing: { after: 60 },
          })
        );
      }
    }
  }

  // Volunteering
  if (data.volunteering.length > 0) {
    paragraphs.push(sectionHeading("Volunteering"));
    for (const vol of data.volunteering) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: vol.role, bold: true, size: 24 }),
            new TextRun({ text: `  –  ${vol.organization}`, size: 24 }),
          ],
          spacing: { before: 160, after: 40 },
        })
      );
      const meta = dateRange(vol.startDate, vol.endDate, vol.current);
      if (meta) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: meta, italics: true, size: 20, color: "666666" })],
            spacing: { after: 60 },
          })
        );
      }
      if (vol.description) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: vol.description, size: 22 })],
            spacing: { after: 100 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
