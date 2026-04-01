import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import type { ResumeData } from "@/types/resume";
import type { ComponentType } from "react";

export const templateComponents: Record<
  string,
  ComponentType<{ data: ResumeData }>
> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
};

export { ModernTemplate, ClassicTemplate, MinimalTemplate, ExecutiveTemplate };
