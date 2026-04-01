export interface PersonalInfo {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  website?: string | null;
  linkedin?: string | null;
  summary?: string | null;
}

export interface Education {
  id: string;
  school: string;
  degree?: string | null;
  field?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
  gpa?: string | null;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
  order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  credentialId?: string | null;
  url?: string | null;
  order: number;
}

export interface Volunteering {
  id: string;
  organization: string;
  role: string;
  startDate?: string | null;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
  order: number;
}

export interface ResumeData {
  template: string;
  personal: PersonalInfo | null;
  education: Education[];
  experience: Experience[];
  certs: Certification[];
  volunteering: Volunteering[];
}

export type TemplateId = "modern" | "classic" | "minimal" | "executive";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean blue accent with two-column layout",
    preview: "bg-blue-500",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional serif typography, elegant borders",
    preview: "bg-gray-700",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean whitespace, contemporary sans-serif",
    preview: "bg-slate-400",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold dark header, corporate professional style",
    preview: "bg-gray-900",
  },
];
