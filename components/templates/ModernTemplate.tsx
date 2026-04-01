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

export function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, certs, volunteering } = data;

  const contactItems = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.website,
    personal?.linkedin,
  ].filter(Boolean);

  return (
    <div className="flex min-h-full w-full font-sans text-sm text-gray-800 bg-white">
      {/* Left Sidebar */}
      <aside className="w-[30%] bg-blue-700 text-white flex flex-col px-6 py-8 gap-6">
        {/* Name */}
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-wide break-words">
            {personal?.fullName ?? "Your Name"}
          </h1>
        </div>

        {/* Contact */}
        {contactItems.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 text-blue-200">
              Contact
            </h2>
            <ul className="flex flex-col gap-1">
              {contactItems.map((item, i) => (
                <li key={i} className="text-sm text-blue-100 break-all">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Summary */}
        {personal?.summary && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-2 text-blue-200">
              Summary
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed whitespace-pre-line">
              {personal.summary}
            </p>
          </section>
        )}
      </aside>

      {/* Right Main */}
      <main className="w-[70%] px-8 py-8 flex flex-col gap-7">
        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-base font-semibold uppercase tracking-wider text-blue-700 border-b-2 border-blue-700 pb-1 mb-4">
              Experience
            </h2>
            <div className="flex flex-col gap-4">
              {experience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      <p className="text-gray-600 text-sm">
                        {job.company}
                        {job.location ? `, ${job.location}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap pt-0.5">
                      {formatDateRange(job.startDate, job.endDate, job.current)}
                    </span>
                  </div>
                  {job.description && (
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
          <section>
            <h2 className="text-base font-semibold uppercase tracking-wider text-blue-700 border-b-2 border-blue-700 pb-1 mb-4">
              Education
            </h2>
            <div className="flex flex-col gap-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{edu.school}</p>
                      <p className="text-sm text-gray-600">
                        {[edu.degree, edu.field].filter(Boolean).join(", ")}
                      </p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap pt-0.5">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
          <section>
            <h2 className="text-base font-semibold uppercase tracking-wider text-blue-700 border-b-2 border-blue-700 pb-1 mb-4">
              Certifications
            </h2>
            <div className="flex flex-col gap-3">
              {certs.map((cert) => (
                <div key={cert.id}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{cert.name}</p>
                      {cert.issuer && (
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                      )}
                      {cert.credentialId && (
                        <p className="text-xs text-gray-500">
                          ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap pt-0.5">
                      {cert.issueDate ?? ""}
                      {cert.expiryDate ? ` – ${cert.expiryDate}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Volunteering */}
        {volunteering.length > 0 && (
          <section>
            <h2 className="text-base font-semibold uppercase tracking-wider text-blue-700 border-b-2 border-blue-700 pb-1 mb-4">
              Volunteering
            </h2>
            <div className="flex flex-col gap-4">
              {volunteering.map((vol) => (
                <div key={vol.id}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{vol.role}</p>
                      <p className="text-sm text-gray-600">{vol.organization}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap pt-0.5">
                      {formatDateRange(vol.startDate, vol.endDate, vol.current)}
                    </span>
                  </div>
                  {vol.description && (
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {vol.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
