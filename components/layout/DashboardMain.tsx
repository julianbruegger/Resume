"use client";

import { usePathname } from "next/navigation";

export default function DashboardMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPreview = pathname === "/dashboard/preview";

  if (isPreview) {
    return <div className="flex-1 overflow-hidden flex flex-col">{children}</div>;
  }

  return <main className="flex-1 overflow-y-auto p-6">{children}</main>;
}
