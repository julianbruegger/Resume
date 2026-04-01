import Link from "next/link";
import { auth } from "@/lib/auth";
import { getResumeData } from "@/lib/resume-data";
import { GraduationCap, Briefcase, Award, Heart, Palette, Download } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id as string;

  const resumeData = await getResumeData(userId);

  const stats = [
    {
      label: "Education",
      count: resumeData?.education?.length ?? 0,
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Experience",
      count: resumeData?.experience?.length ?? 0,
      icon: Briefcase,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Certifications",
      count: resumeData?.certs?.length ?? 0,
      icon: Award,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Volunteering",
      count: resumeData?.volunteering?.length ?? 0,
      icon: Heart,
      color: "bg-pink-50 text-pink-600",
    },
  ];

  const userName = session?.user?.name?.split(" ")[0] ?? "there";
  const currentTemplate = resumeData?.template ?? "classic";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your resume progress.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, count, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Current template */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <Palette className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">Current Template</p>
          <p className="text-base font-semibold text-gray-900 capitalize">{currentTemplate}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
          {currentTemplate}
        </span>
      </div>

      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/templates"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          <Palette className="h-4 w-4" />
          View Templates
        </Link>
        <Link
          href="/dashboard/export"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 transition-colors duration-150"
        >
          <Download className="h-4 w-4" />
          Export Resume
        </Link>
      </div>
    </div>
  );
}
