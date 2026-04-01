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
    <div className="mt-8 mb-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 pb-2 border-b-4 border-gray-800">
        {title}
      </h2>
    </div>
  );
}

export function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personal, experience, education, certs, volunteering } = data;

  const contactParts = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.website,
    personal?.linkedin,
  ].filter(Boolean);

  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-900 text-sm">
      {/* Full-width dark charcoal header */}
      <header className="bg-gray-900 text-white px-12 py-8">
        <h1 className="text-3xl font-bold tracking-wide uppercase">
          {personal?.fullName ?? "Your Name"}
        </h1>
        {contactParts.length > 0 && (
          <p className="mt-2 text-sm text-gray-400 tracking-wide">
            {contactParts.join("   |   ")}
          </p>
        )}
        {personal?.summary && (
          <p className="mt-3 text-sm text-gray-300 leading-relaxed max-w-3xl whitespace-pre-line">
            {personal.summary}
          </p>
        )}
      </header>

      {/* Body */}
      <div className="px-12 pb-10">
        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <SectionHeader title="Professional Experience" />
            <div className="flex flex-col gap-5">
              {experience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline gap-4">
                    <div>
                      <p className="text-base font-bold text-gray-900 uppercase tracking-wide">
                        {job.title}
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mt-0.5">
                        {job.company}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                      {formatDateRange(job.startDate, job.endDate, job.current)}
                    </span>
                  </div>
                  {job.description && (
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
            <SectionHeader title="Education" />
            <div className="flex flex-col gap-5">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline gap-4">
                    <div>
                      <p className="text-base font-bold text-gray-900 uppercase tracking-wide">
                        {edu.school}
                      </p>
                      {(edu.degree || edu.field) && (
                        <p className="text-sm font-semibold text-gray-600 mt-0.5">
                          {[edu.degree, edu.field].filter(Boolean).join(", ")}
                          {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
            <SectionHeader title="Certifications" />
            <div className="flex flex-col gap-4">
              {certs.map((cert) => (
                <div key={cert.id}>
                  <div className="flex justify-between items-baseline gap-4">
                    <div>
                      <p className="text-base font-bold text-gray-900 uppercase tracking-wide">
                        {cert.name}
                      </p>
                      {cert.issuer && (
                        <p className="text-sm font-semibold text-gray-600 mt-0.5">
                          {cert.issuer}
                        </p>
                      )}
                      {cert.credentialId && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
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
            <SectionHeader title="Volunteering" />
            <div className="flex flex-col gap-5">
              {volunteering.map((vol) => (
                <div key={vol.id}>
                  <div className="flex justify-between items-baseline gap-4">
                    <div>
                      <p className="text-base font-bold text-gray-900 uppercase tracking-wide">
                        {vol.role}
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mt-0.5">
                        {vol.organization}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                      {formatDateRange(vol.startDate, vol.endDate, vol.current)}
                    </span>
                  </div>
                  {vol.description && (
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {vol.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
