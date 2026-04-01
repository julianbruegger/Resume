import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import React from "react";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#333" },
  header: { marginBottom: 16, borderBottomWidth: 2, borderBottomColor: "#1d4ed8", paddingBottom: 10 },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#1d4ed8", marginBottom: 4 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, color: "#555", fontSize: 9 },
  contactItem: { marginRight: 12 },
  summary: { marginTop: 8, fontSize: 10, lineHeight: 1.5, color: "#444" },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1d4ed8",
    marginTop: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#bfdbfe",
    paddingBottom: 3,
    textTransform: "uppercase",
  },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 10.5 },
  entrySubtitle: { fontSize: 9.5, color: "#555" },
  entryDate: { fontSize: 9, color: "#777", textAlign: "right" },
  entryDesc: { fontSize: 9.5, color: "#444", marginTop: 3, lineHeight: 1.5 },
  entryMeta: { fontSize: 9, color: "#666", marginBottom: 2 },
  entryBlock: { marginBottom: 10 },
});

function dateRange(start?: string | null, end?: string | null, current?: boolean): string {
  const s = start || "";
  const e = current ? "Present" : end || "";
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

function PdfDocument({ data }: { data: ResumeData }) {
  const p = data.personal;
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.name }, p?.fullName || "Your Name"),
        React.createElement(
          View,
          { style: styles.contactRow },
          ...[p?.email, p?.phone, p?.location, p?.website, p?.linkedin]
            .filter(Boolean)
            .map((item, i) => React.createElement(Text, { key: i, style: styles.contactItem }, item!))
        ),
        p?.summary
          ? React.createElement(Text, { style: styles.summary }, p.summary)
          : null
      ),
      // Experience
      data.experience.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.sectionTitle }, "Work Experience"),
            ...data.experience.map((exp) =>
              React.createElement(
                View,
                { key: exp.id, style: styles.entryBlock },
                React.createElement(
                  View,
                  { style: styles.entryRow },
                  React.createElement(Text, { style: styles.entryTitle }, `${exp.title}  –  ${exp.company}`),
                  React.createElement(Text, { style: styles.entryDate }, dateRange(exp.startDate, exp.endDate, exp.current))
                ),
                exp.location
                  ? React.createElement(Text, { style: styles.entryMeta }, exp.location)
                  : null,
                exp.description
                  ? React.createElement(Text, { style: styles.entryDesc }, exp.description)
                  : null
              )
            )
          )
        : null,
      // Education
      data.education.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.sectionTitle }, "Education"),
            ...data.education.map((edu) => {
              const degreeField = [edu.degree, edu.field].filter(Boolean).join(" in ");
              return React.createElement(
                View,
                { key: edu.id, style: styles.entryBlock },
                React.createElement(
                  View,
                  { style: styles.entryRow },
                  React.createElement(
                    Text,
                    { style: styles.entryTitle },
                    degreeField ? `${edu.school}  –  ${degreeField}` : edu.school
                  ),
                  React.createElement(Text, { style: styles.entryDate }, dateRange(edu.startDate, edu.endDate, edu.current))
                ),
                edu.gpa
                  ? React.createElement(Text, { style: styles.entryMeta }, `GPA: ${edu.gpa}`)
                  : null,
                edu.description
                  ? React.createElement(Text, { style: styles.entryDesc }, edu.description)
                  : null
              );
            })
          )
        : null,
      // Certifications
      data.certs.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.sectionTitle }, "Certifications"),
            ...data.certs.map((cert) =>
              React.createElement(
                View,
                { key: cert.id, style: styles.entryBlock },
                React.createElement(
                  View,
                  { style: styles.entryRow },
                  React.createElement(
                    Text,
                    { style: styles.entryTitle },
                    cert.issuer ? `${cert.name}  –  ${cert.issuer}` : cert.name
                  ),
                  React.createElement(Text, { style: styles.entryDate }, cert.issueDate || "")
                ),
                cert.expiryDate
                  ? React.createElement(Text, { style: styles.entryMeta }, `Expires: ${cert.expiryDate}`)
                  : null
              )
            )
          )
        : null,
      // Volunteering
      data.volunteering.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.sectionTitle }, "Volunteering"),
            ...data.volunteering.map((vol) =>
              React.createElement(
                View,
                { key: vol.id, style: styles.entryBlock },
                React.createElement(
                  View,
                  { style: styles.entryRow },
                  React.createElement(Text, { style: styles.entryTitle }, `${vol.role}  –  ${vol.organization}`),
                  React.createElement(Text, { style: styles.entryDate }, dateRange(vol.startDate, vol.endDate, vol.current))
                ),
                vol.description
                  ? React.createElement(Text, { style: styles.entryDesc }, vol.description)
                  : null
              )
            )
          )
        : null
    )
  );
}

export async function generatePdf(data: ResumeData): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(PdfDocument, { data }) as any;
  return await renderToBuffer(element);
}
