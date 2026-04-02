"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Briefcase, Award, Heart, Palette, Download } from "lucide-react";
import { useDataClient } from "@/lib/data-client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const client = useDataClient();
  const [counts, setCounts] = useState({ education: 0, experience: 0, certs: 0, volunteering: 0 });
  const [template, setTemplate] = useState("modern");

  useEffect(() => {
    async function load() {
      const [edu, exp, certs, vol, tmpl] = await Promise.all([
        client.education.list(),
        client.experience.list(),
        client.certifications.list(),
        client.volunteering.list(),
        client.resume.getTemplate(),
      ]);
      setCounts({ education: edu.length, experience: exp.length, certs: certs.length, volunteering: vol.length });
      setTemplate(tmpl);
    }
    load();
  }, [client]);

  const userName = session?.user?.name?.split(" ")[0] ?? "there";

  const stats = [
    { label: "Education", count: counts.education, icon: GraduationCap, color: "bg-brand-dim text-brand" },
    { label: "Experience", count: counts.experience, icon: Briefcase, color: "bg-exp-dim text-exp" },
    { label: "Certifications", count: counts.certs, icon: Award, color: "bg-cert-dim text-cert" },
    { label: "Volunteering", count: counts.volunteering, icon: Heart, color: "bg-vol-dim text-vol" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">
          {session ? `Welcome back, ${userName}!` : "Welcome!"}
        </h1>
        <p className="text-ink-soft mt-1">Here&apos;s an overview of your resume progress.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="bg-surface rounded-xl border border-rim shadow-sm p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{count}</p>
              <p className="text-sm text-ink-soft">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-rim shadow-sm p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-tpl-dim text-tpl flex items-center justify-center">
          <Palette className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-ink-soft">Current Template</p>
          <p className="text-base font-semibold text-ink capitalize">{template}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tpl-dim text-tpl capitalize">
          {template}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/templates"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-h text-brand-fg text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          <Palette className="h-4 w-4" />
          View Templates
        </Link>
        <Link
          href="/dashboard/export"
          className="inline-flex items-center gap-2 bg-surface hover:bg-raised text-ink text-sm font-medium px-4 py-2.5 rounded-lg border border-rim transition-colors duration-150"
        >
          <Download className="h-4 w-4" />
          Export Resume
        </Link>
      </div>
    </div>
  );
}
