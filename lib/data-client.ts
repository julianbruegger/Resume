/**
 * Unified data access layer.
 * - Authenticated users: calls the REST API
 * - Guest users: reads/writes localStorage via guest-storage
 *
 * Usage (in client components):
 *   const client = useDataClient();
 *   const entries = await client.education.list();
 */

"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import type { PersonalInfo, Education, Experience, Certification, Volunteering } from "@/types/resume";
import {
  guestList,
  guestCreate,
  guestUpdate,
  guestDelete,
  guestGetPersonal,
  guestSavePersonal,
  guestGetTemplate,
  guestSetTemplate,
  guestGetAllData,
} from "@/lib/guest-storage";
import type { ResumeData } from "@/types/resume";

// ── Generic section client factory ───────────────────────────────────────────

function makeSectionClient<T extends { id: string; order: number }>(
  apiPath: string,
  storageKey: "education" | "experience" | "certifications" | "volunteering",
  isGuest: boolean
) {
  return {
    async list(): Promise<T[]> {
      if (isGuest) return guestList<T>(storageKey);
      const res = await fetch(apiPath);
      if (!res.ok) throw new Error(`Failed to fetch ${storageKey}`);
      return res.json();
    },
    async create(data: Omit<T, "id" | "order">): Promise<T> {
      if (isGuest) return guestCreate<T>(storageKey, data) as T;
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create ${storageKey}`);
      return res.json();
    },
    async update(id: string, data: Partial<T>): Promise<T> {
      if (isGuest) return guestUpdate<T>(storageKey, id, data);
      const res = await fetch(`${apiPath}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update ${storageKey}`);
      return res.json();
    },
    async remove(id: string): Promise<void> {
      if (isGuest) return guestDelete(storageKey, id);
      const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete ${storageKey}`);
    },
  };
}

// ── Full data client ─────────────────────────────────────────────────────────

function makeDataClient(isGuest: boolean) {
  return {
    education: makeSectionClient<Education>("/api/education", "education", isGuest),
    experience: makeSectionClient<Experience>("/api/experience", "experience", isGuest),
    certifications: makeSectionClient<Certification>("/api/certifications", "certifications", isGuest),
    volunteering: makeSectionClient<Volunteering>("/api/volunteering", "volunteering", isGuest),

    personal: {
      async get(): Promise<PersonalInfo | null> {
        if (isGuest) return guestGetPersonal();
        const res = await fetch("/api/personal");
        if (!res.ok) return null;
        return res.json();
      },
      async save(data: Omit<PersonalInfo, "id">): Promise<PersonalInfo> {
        if (isGuest) return guestSavePersonal(data);
        const res = await fetch("/api/personal", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to save personal info");
        return res.json();
      },
    },

    resume: {
      async getTemplate(): Promise<string> {
        if (isGuest) return guestGetTemplate();
        const res = await fetch("/api/resume");
        if (!res.ok) return "modern";
        const data = await res.json();
        return data?.template ?? "modern";
      },
      async setTemplate(template: string): Promise<void> {
        if (isGuest) return guestSetTemplate(template);
        await fetch("/api/resume", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template }),
        });
      },

      async getAll(): Promise<ResumeData> {
        if (isGuest) return guestGetAllData();
        const [template, personal, education, experience, certs, volunteering] = await Promise.all([
          fetch("/api/resume").then((r) => r.json()).then((d) => d?.template ?? "modern"),
          fetch("/api/personal").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/education").then((r) => r.json()),
          fetch("/api/experience").then((r) => r.json()),
          fetch("/api/certifications").then((r) => r.json()),
          fetch("/api/volunteering").then((r) => r.json()),
        ]);
        return { template, personal, education, experience, certs, volunteering };
      },
    },
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useDataClient() {
  const { status } = useSession();
  const isGuest = status !== "authenticated";
  // Stable reference — only recreates when auth state changes
  return useMemo(() => makeDataClient(isGuest), [isGuest]);
}
