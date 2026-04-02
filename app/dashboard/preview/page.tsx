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
      <div className="flex items-center justify-between px-6 py-3 bg-surface border-b border-rim flex-shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-ink">Preview</span>
          <span className="text-xs bg-raised text-ink-dim px-2 py-0.5 rounded-full">
            {templateLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
            className="p-1.5 rounded hover:bg-raised text-ink-soft"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-ink-soft w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(1.2, s + 0.1))}
            className="p-1.5 rounded hover:bg-raised text-ink-soft"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-rim mx-1" />

          {/* Refresh */}
          <button
            onClick={load}
            disabled={loading}
            className="p-1.5 rounded hover:bg-raised text-ink-soft disabled:opacity-40"
            aria-label="Refresh preview"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <div className="w-px h-5 bg-rim mx-1" />

          {/* Action links */}
          <Link
            href="/dashboard/templates"
            className="flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-brand px-2 py-1.5 rounded hover:bg-raised transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            Change template
          </Link>

          {isGuest ? (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-medium bg-prominent hover:bg-prominent-h text-prominent-fg px-3 py-1.5 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Sign in to export
            </Link>
          ) : (
            <Link
              href="/dashboard/export"
              className="flex items-center gap-1.5 text-xs font-medium bg-brand hover:bg-brand-h text-brand-fg px-3 py-1.5 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Link>
          )}
        </div>
      </div>

      {/* Preview area — neutral gray backdrop simulates print context */}
      <div className="flex-1 overflow-auto bg-neutral-200 dark:bg-neutral-800 flex items-start justify-center p-8">
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
