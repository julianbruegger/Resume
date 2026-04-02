"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Palette, Download, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useDataClient } from "@/lib/data-client";
import { useSession } from "next-auth/react";
import { templateComponents } from "@/components/templates";
import { TEMPLATES } from "@/types/resume";
import type { ResumeData } from "@/types/resume";

export default function PreviewPage() {
  const client = useDataClient();
  const { status } = useSession();
  const isGuest = status !== "authenticated";

  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(0.65);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await client.resume.getAll();
      setData(all);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    load();
  }, [load]);

  const TemplateComponent = data ? (templateComponents[data.template] ?? templateComponents.modern) : null;
  const templateLabel = TEMPLATES.find((t) => t.id === data?.template)?.name ?? "Modern";

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Preview</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {templateLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(1.2, s + 0.1))}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Refresh */}
          <button
            onClick={load}
            disabled={loading}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Action links */}
          <Link
            href="/dashboard/templates"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            Change template
          </Link>

          {isGuest ? (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-medium bg-gray-900 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Sign in to export
            </Link>
          ) : (
            <Link
              href="/dashboard/export"
              className="flex items-center gap-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Link>
          )}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-gray-300 flex items-start justify-center p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent opacity-60" />
          </div>
        ) : !TemplateComponent || !data ? (
          <div className="text-white opacity-60 text-sm">No resume data yet. Start filling in your sections.</div>
        ) : (
          <div
            className="origin-top shadow-2xl"
            style={{
              transform: `scale(${scale})`,
              width: 816,
              minHeight: 1056,
            }}
          >
            <TemplateComponent data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
