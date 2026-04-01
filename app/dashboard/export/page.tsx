"use client";

import { useState } from "react";
import { Download, FileText, File } from "lucide-react";

export default function ExportPage() {
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
    } catch (e) {
      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
