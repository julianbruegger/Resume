"use client";

import { useEffect, useState } from "react";

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  color: string;
}

const templates: TemplateOption[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean blue accent with two-column layout",
    color: "bg-blue-600",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional serif typography, elegant",
    color: "bg-gray-700",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean whitespace, contemporary",
    color: "bg-slate-400",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold dark header, corporate professional",
    color: "bg-gray-900",
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentTemplate() {
      try {
        const res = await fetch("/api/resume");
        if (!res.ok) throw new Error("Failed to load resume data");
        const data = await res.json();
        setSelectedTemplate(data.template ?? "modern");
      } catch (err) {
        setError("Could not load current template.");
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentTemplate();
  }, []);

  async function handleSelect(templateId: string) {
    if (templateId === selectedTemplate || saving) return;

    setSaving(templateId);
    setError(null);

    try {
      const res = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: templateId }),
      });

      if (!res.ok) throw new Error("Failed to save template");

      setSelectedTemplate(templateId);
    } catch (err) {
      setError("Could not save template selection. Please try again.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Choose a Template</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select the design that best represents you. Your content stays the same.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-36 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {templates.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            const isSaving = saving === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className={`relative rounded-xl border-2 overflow-hidden transition-shadow ${
                  isSelected
                    ? "border-blue-600 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Selected
                  </div>
                )}

                {/* Mini preview */}
                <div className={`h-36 w-full ${tmpl.color} flex items-end px-4 pb-3`}>
                  <div className="space-y-1 w-full">
                    <div className="h-2.5 w-2/5 rounded bg-white opacity-90" />
                    <div className="h-1.5 w-3/5 rounded bg-white opacity-50" />
                    <div className="h-1.5 w-1/2 rounded bg-white opacity-40" />
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 bg-white">
                  <h2 className="text-base font-semibold text-gray-900">
                    {tmpl.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">{tmpl.description}</p>

                  <div className="mt-4">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-200">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Selected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSelect(tmpl.id)}
                        disabled={!!saving}
                        className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSaving ? "Saving…" : "Select"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
