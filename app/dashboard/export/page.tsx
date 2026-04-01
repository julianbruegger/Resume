"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText, File, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ExportPage() {
  const { status } = useSession();
  const isGuest = status !== "authenticated";

  const [pdfLoading, setPdfLoading] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);

  async function handleExport(format: "pdf" | "docx") {
    const setLoading = format === "pdf" ? setPdfLoading : setDocxLoading;
    setLoading(true);
    try {
      const res = await fetch(`/api/export/${format}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = format === "pdf" ? "resume.pdf" : "resume.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isGuest) {
    return (
      <div className="max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Export Resume</h1>
        <p className="text-gray-500 mb-8">
          Download your resume as PDF or Word document.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg shrink-0">
              <LogIn className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Sign in to export</h2>
              <p className="text-sm text-gray-600">
                Exporting requires a free GitHub account so your resume data can be
                securely processed on the server. Your guest data will be waiting when
                you return.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="self-start flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Sign in with GitHub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Export Resume</h1>
      <p className="text-gray-500 mb-8">
        Download your resume in your preferred format. Make sure your resume is complete before exporting.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* PDF */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">PDF Document</h2>
              <p className="text-sm text-gray-500">Best for sharing & printing</p>
            </div>
          </div>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✓ Preserves formatting</li>
            <li>✓ Universal compatibility</li>
            <li>✓ Print-ready</li>
          </ul>
          <button
            onClick={() => handleExport("pdf")}
            disabled={pdfLoading}
            className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pdfLoading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {pdfLoading ? "Generating..." : "Download PDF"}
          </button>
        </div>

        {/* Word */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <File className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Word Document</h2>
              <p className="text-sm text-gray-500">Best for further editing</p>
            </div>
          </div>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✓ Fully editable</li>
            <li>✓ Microsoft Word & LibreOffice</li>
            <li>✓ Easy to customize</li>
          </ul>
          <button
            onClick={() => handleExport("docx")}
            disabled={docxLoading}
            className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {docxLoading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {docxLoading ? "Generating..." : "Download Word"}
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <strong>Tip:</strong> Choose a template first on the{" "}
        <a href="/dashboard/templates" className="underline font-medium">
          Templates page
        </a>{" "}
        to customize the look of your PDF export.
      </div>
    </div>
  );
}
