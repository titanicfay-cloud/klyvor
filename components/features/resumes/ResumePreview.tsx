"use client";
import { ResumeData } from "@/lib/resume-types";
import TemplateAts from "./templates/TemplateAts";
import TemplateModern from "./templates/TemplateModern";
import TemplateClassic from "./templates/TemplateClassic";

export default function ResumePreview({ data, template }: { data: ResumeData, template: string }) {
  if (template === "modern") return <TemplateModern data={data} />;
  if (template === "classic") return <TemplateClassic data={data} />;
  return <TemplateAts data={data} />;
}
