import type { ResumeData } from "@/types/resume";

function formatDateRange(
  startDate?: string | null,
  endDate?: string | null,
  current?: boolean
): string {
  const start = startDate ?? "";
  const end = current ? "Present" : (endDate ?? "");
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} – ${end}`;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-6 mb-3">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
        {title}
      </h2>
      <hr className="border-t border-gray-400 mt-1" />
    </div>
  );
}

export function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, certs, volunteering } = data;

  const contactParts = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.website,
    personal?.linkedin,
  ].filter(Boolean);

  return (
    <div className="w-full min-h-full bg-white px-12 py-10 font-serif text-gray-900 text-sm">
      {/* Header */}
      <div className="text-center mb-1">
        <h1 className="text-3xl font-bold tracking-wide">
          {personal?.fullName ?? "Your Name"}
        </h1>
        {contactParts.length > 0 && (
          <p className="mt-1 text-xs text-gray-600 tracking-wide">
            {contactParts.join("  |  ")}
          </p>
        )}
      </div>

      <hr className="border-t-2 border-gray-800 mt-3 mb-1" />

      {/* Summary */}
      {personal?.summary && (
        <div className="mt-3">
          <p className="text-sm text-gray-700 leading-relaxed text-center italic whitespace-pre-line">
            {personal.summary}
          </p>
          <hr className="border-t border-gray-300 mt-3" />
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <SectionHeader title="Professional Experience" />
          <div className="flex flex-col gap-4">
            {experience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{job.title}</span>
                  <span className="text-xs text-gray-600">
                    {formatDateRange(job.startDate, job.endDate, job.current)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="italic text-gray-700 text-sm">
                    {job.company}
                    {job.location ? `, ${job.location}` : ""}
                  </span>
                </div>
                {job.description && (
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                )}
                <hr className="border-t border-gray-200 mt-3" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <SectionHeader title="Education" />
          <div className="flex flex-col gap-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{edu.school}</span>
                  <span className="text-xs text-gray-600">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                {(edu.degree || edu.field) && (
                  <p className="italic text-gray-700 text-sm">
                    {[edu.degree, edu.field].filter(Boolean).join(", ")}
                    {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                  </p>
                )}
                {edu.description && (
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {edu.description}
                  </p>
                )}
                <hr className="border-t border-gray-200 mt-3" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <section>
          <SectionHeader title="Certifications" />
          <div className="flex flex-col gap-3">
            {certs.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{cert.name}</span>
                  <span className="text-xs text-gray-600">
                    {cert.issueDate ?? ""}
                    {cert.expiryDate ? ` – ${cert.expiryDate}` : ""}
                  </span>
                </div>
                {cert.issuer && (
                  <p className="italic text-gray-700 text-sm">{cert.issuer}</p>
                )}
                {cert.credentialId && (
                  <p className="text-xs text-gray-500">
                    Credential ID: {cert.credentialId}
                  </p>
                )}
                <hr className="border-t border-gray-200 mt-3" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteering */}
      {volunteering.length > 0 && (
        <section>
          <SectionHeader title="Volunteering" />
          <div className="flex flex-col gap-4">
            {volunteering.map((vol) => (
              <div key={vol.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{vol.role}</span>
                  <span className="text-xs text-gray-600">
                    {formatDateRange(vol.startDate, vol.endDate, vol.current)}
                  </span>
                </div>
                <p className="italic text-gray-700 text-sm">{vol.organization}</p>
                {vol.description && (
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {vol.description}
                  </p>
                )}
                <hr className="border-t border-gray-200 mt-3" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
