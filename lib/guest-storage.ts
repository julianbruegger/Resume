/**
 * localStorage-backed storage for unauthenticated (guest) users.
 * Data is keyed by section name and persisted in the browser.
 */

import type { PersonalInfo, Education, Experience, Certification, Volunteering } from "@/types/resume";

function uid(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function getKey(section: string): string {
  return `resume_builder_${section}`;
}

function loadList<T>(section: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(getKey(section)) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function saveList<T>(section: string, items: T[]): void {
  localStorage.setItem(getKey(section), JSON.stringify(items));
}

function loadObject<T>(section: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getKey(section));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveObject<T>(section: string, obj: T): void {
  localStorage.setItem(getKey(section), JSON.stringify(obj));
}

// ── List sections ────────────────────────────────────────────────────────────

type ListSection = "education" | "experience" | "certifications" | "volunteering";

export function guestList<T extends { id: string; order: number }>(section: ListSection): T[] {
  return loadList<T>(section).sort((a, b) => a.order - b.order);
}

export function guestCreate<T extends { id?: string; order?: number }>(
  section: ListSection,
  data: Omit<T, "id" | "order">
): T {
  const items = loadList<T>(section);
  const newItem = { ...data, id: uid(), order: items.length } as T;
  saveList(section, [...items, newItem]);
  return newItem;
}

export function guestUpdate<T extends { id: string }>(
  section: ListSection,
  id: string,
  data: Partial<T>
): T {
  const items = loadList<T>(section);
  const updated = items.map((item) => (item.id === id ? { ...item, ...data } : item));
  saveList(section, updated);
  return updated.find((item) => item.id === id)!;
}

export function guestDelete(section: ListSection, id: string): void {
  const items = loadList<{ id: string }>(section);
  saveList(section, items.filter((item) => item.id !== id));
}

// ── Personal info ────────────────────────────────────────────────────────────

export function guestGetPersonal(): PersonalInfo | null {
  return loadObject<PersonalInfo>("personal");
}

export function guestSavePersonal(data: Omit<PersonalInfo, "id">): PersonalInfo {
  const existing = loadObject<PersonalInfo>("personal");
  const updated: PersonalInfo = { id: existing?.id ?? uid(), ...data };
  saveObject("personal", updated);
  return updated;
}

// ── Template ─────────────────────────────────────────────────────────────────

export function guestGetTemplate(): string {
  return loadObject<{ template: string }>("resume")?.template ?? "modern";
}

export function guestSetTemplate(template: string): void {
  saveObject("resume", { template });
}

// ── Full export ───────────────────────────────────────────────────────────────

export function guestGetAllData() {
  return {
    template: guestGetTemplate(),
    personal: guestGetPersonal(),
    education: guestList<Education>("education"),
    experience: guestList<Experience>("experience"),
    certs: guestList<Certification>("certifications"),
    volunteering: guestList<Volunteering>("volunteering"),
  };
}
