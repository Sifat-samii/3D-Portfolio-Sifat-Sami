import type { ProjectItem, SkillItem } from "@/types/portfolio";

export const webProjects: ProjectItem[] = [
  {
    title: "3D Portfolio MVP",
    description:
      "A modular interactive portfolio world using Next.js, React Three Fiber, Zustand, and typed content data.",
    tech: ["Next.js", "TypeScript", "R3F", "Zustand"],
    type: "Interactive web experience",
    status: "MVP",
    link: "#",
    highlights: ["Data-driven rooms", "Keyboard interaction", "Mobile fallback"],
  },
  {
    title: "Product Dashboard Placeholder",
    description:
      "A future case study slot for dashboards, SaaS tools, internal operations systems, or client web apps.",
    tech: ["React", "Automation", "Analytics"],
    type: "Product system",
    status: "Placeholder",
    link: "#",
    highlights: ["Workflow clarity", "Operational visibility", "Reusable UI"],
  },
];

export const techStack: SkillItem[] = [
  { label: "Product Management", category: "Product" },
  { label: "Next.js", category: "Frontend" },
  { label: "TypeScript", category: "Frontend" },
  { label: "Automation", category: "Systems" },
  { label: "AI Workflows", category: "Systems" },
];
