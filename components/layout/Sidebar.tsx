"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Heart,
  Palette,
  Download,
  Eye,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/personal", label: "Personal Info", icon: User },
  { href: "/dashboard/education", label: "Education", icon: GraduationCap },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { href: "/dashboard/certifications", label: "Certifications", icon: Award },
  { href: "/dashboard/volunteering", label: "Volunteering", icon: Heart },
  { href: "/dashboard/templates", label: "Templates", icon: Palette },
  { href: "/dashboard/preview", label: "Preview", icon: Eye },
  { href: "/dashboard/export", label: "Export", icon: Download },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* App name */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-lg font-bold text-blue-600 tracking-tight">
          VitaFlow
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            // Exact match for /dashboard, prefix match for sub-routes
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === href || pathname.startsWith(href + "/");

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
