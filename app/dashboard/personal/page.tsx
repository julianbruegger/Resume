"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { PersonalInfo } from "@/types/resume";
import { useDataClient } from "@/lib/data-client";

type FormValues = Omit<PersonalInfo, "id">;

export default function PersonalPage() {
  const client = useDataClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    client.personal.get()
      .then((data: PersonalInfo | null) => {
        if (data) {
          reset({
            fullName: data.fullName ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            location: data.location ?? "",
            website: data.website ?? "",
            linkedin: data.linkedin ?? "",
            summary: data.summary ?? "",
          });
        }
      })
      .catch(() => showToast("error", "Failed to load personal info."))
      .finally(() => setLoading(false));
  }, [reset]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      await client.personal.save(values);
      showToast("success", "Personal info saved successfully.");
    } catch {
      showToast("error", "Failed to save personal info.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Personal Information</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Update your contact details and professional summary shown on your resume.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
          className={`mb-4 rounded-md px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-ok-dim text-ok-fg border border-ok/20"
              : "bg-bad-dim text-bad-fg border border-bad/20"
          }`}
        >
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : (
        <div className="bg-surface rounded-lg shadow-sm border border-rim p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1">
                Full Name <span className="text-bad">*</span>
              </label>
              <input
                {...register("fullName", { required: "Full name is required" })}
                type="text"
                placeholder="Jane Doe"
                className="w-full rounded-md border border-rim bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-dim shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-bad">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1">
                Email <span className="text-bad">*</span>
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
                })}
                type="email"
                placeholder="jane@example.com"
                className="w-full rounded-md border border-rim bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-dim shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-bad">{errors.email.message}</p>
              )}
            </div>

            {/* Phone & Location */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1">Phone</label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-md border border-rim bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-dim shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1">Location</label>
                <input
                  {...register("location")}
                  type="text"
                  placeholder="San Francisco, CA"
                  className="w-full rounded-md border border-rim bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-dim shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            {/* Website & LinkedIn */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1">Website</label>
                <input
                  {...register("website")}
                  type="url"
                  placeholder="https://janedoe.dev"
                  className="w-full rounded-md border border-rim bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-dim shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1">
                  LinkedIn URL
                </label>
                <input
                  {...register("linkedin")}
                  type="url"
                  placeholder="https://linkedin.com/in/janedoe"
                  className="w-full rounded-md border border-rim bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-dim shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1">
                Professional Summary
              </label>
              <textarea
                {...register("summary")}
                rows={5}
                placeholder="Write a brief summary of your professional background and goals..."
                className="w-full rounded-md border border-rim bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-dim shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-y"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2 text-sm font-medium text-brand-fg shadow-sm hover:bg-brand-h disabled:opacity-60 focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                {saving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-fg border-t-transparent" />
                )}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
