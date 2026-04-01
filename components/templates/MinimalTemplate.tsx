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
    <h2 className="text-xs uppercase tracking-widest text-gray-400 font-normal mb-3">
      {title}
    </h2>
  );
}

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, certs, volunteering } = data;

  const contactParts = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.website,
    personal?.linkedin,
  ].filter(Boolean);

  return (
    <div className="w-full min-h-full bg-white px-12 py-10 font-sans text-gray-800 text-sm">
      {/* Name */}
      <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-2">
        {personal?.fullName ?? "Your Name"}
      </h1>

      {/* Contact – inline with dot separators */}
      {contactParts.length > 0 && (
        <p className="text-xs text-gray-500 mb-2">
          {contactParts.map((item, i) => (
            <span key={i}>
              {i > 0 && (
                <span className="mx-2 text-gray-300" aria-hidden="true">
                  ·
                </span>
              )}
              {item}
            </span>
          ))}
        </p>
      )}

      {/* Summary */}
      {personal?.summary && (
        <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-1 whitespace-pre-line max-w-2xl">
          {personal.summary}
        </p>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Experience" />
          <div className="flex flex-col">
            {experience.map((job) => (
              <div
                key={job.id}
                className="border-l-2 border-gray-200 pl-4 py-4"
              >
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-medium text-gray-900">{job.title}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDateRange(job.startDate, job.endDate, job.current)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {job.company}
                  {job.location ? ` · ${job.location}` : ""}
                </p>
                {job.description && (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Education" />
          <div className="flex flex-col">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="border-l-2 border-gray-200 pl-4 py-4"
              >
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-medium text-gray-900">{edu.school}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                {(edu.degree || edu.field) && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {[edu.degree, edu.field].filter(Boolean).join(", ")}
                    {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                  </p>
                )}
                {edu.description && (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Certifications" />
          <div className="flex flex-col">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="border-l-2 border-gray-200 pl-4 py-4"
              >
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-medium text-gray-900">{cert.name}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {cert.issueDate ?? ""}
                    {cert.expiryDate ? ` – ${cert.expiryDate}` : ""}
                  </span>
                </div>
                {cert.issuer && (
                  <p className="text-xs text-gray-500 mt-0.5">{cert.issuer}</p>
                )}
                {cert.credentialId && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteering */}
      {volunteering.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Volunteering" />
          <div className="flex flex-col">
            {volunteering.map((vol) => (
              <div
                key={vol.id}
                className="border-l-2 border-gray-200 pl-4 py-4"
              >
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-medium text-gray-900">{vol.role}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDateRange(vol.startDate, vol.endDate, vol.current)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{vol.organization}</p>
                {vol.description && (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {vol.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
