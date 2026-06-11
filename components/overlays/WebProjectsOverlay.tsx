"use client";

import type { OverlayId } from "@/types/portfolio";
import { techStack, webProjects } from "@/data/webProjects";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

const titles: Partial<Record<OverlayId, string>> = {
  webProjects: "Web Projects",
  techStack: "Tech Stack",
  productCaseStudies: "Product Case Studies",
  automationSystems: "Automation & AI Systems",
};

const subtitles: Partial<Record<OverlayId, string>> = {
  webProjects: "Websites, software systems, and interactive web experiences.",
  techStack: "Core tools and capabilities across product, frontend, and systems work.",
  productCaseStudies: "Product dashboards, SaaS tools, and operational systems.",
  automationSystems: "Automation, AI workflows, and systems-oriented delivery.",
};

export function WebProjectsOverlay({ overlayId, onClose }: { overlayId: OverlayId; onClose: () => void }) {
  const accent = getOverlayAccent(overlayId);
  const productProjects = webProjects.filter((project) => /product/i.test(project.type));
  const automationSkills = techStack.filter(
    (skill) => skill.category === "Systems" || /automation|ai/i.test(skill.label),
  );

  return (
    <BaseOverlay
      title={titles[overlayId] ?? "Web & Digital Services"}
      subtitle={
        subtitles[overlayId] ??
        "Websites, software systems, product work, automation, AI workflows, and technical case studies."
      }
      accentColor={accent}
      onClose={onClose}
    >
      {overlayId === "webProjects" ? (
        <div className="grid gap-4">
          {webProjects.length === 0 ? (
            <EmptyState />
          ) : (
            webProjects.map((project) => (
              <Card key={project.title}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{project.description}</p>
                  </div>
                  <Badge>{project.status}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={`${project.title}-${tech}`}>{tech}</Badge>
                  ))}
                </div>
                {project.link ? (
                  <div className="mt-4">
                    <ButtonLink href={project.link} variant="ghost" className="px-0">
                      View project →
                    </ButtonLink>
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </div>
      ) : null}

      {overlayId === "techStack" ? (
        <div className="flex flex-wrap gap-2">
          {techStack.length === 0 ? (
            <EmptyState />
          ) : (
            techStack.map((skill) => <Badge key={skill.label}>{skill.label}</Badge>)
          )}
        </div>
      ) : null}

      {overlayId === "productCaseStudies" ? (
        <div className="grid gap-4">
          {(productProjects.length > 0 ? productProjects : webProjects).length === 0 ? (
            <EmptyState />
          ) : (
            (productProjects.length > 0 ? productProjects : webProjects).map((project) => (
              <Card key={`product-${project.title}`}>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{project.description}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                {project.link ? (
                  <div className="mt-4">
                    <ButtonLink href={project.link} variant="ghost" className="px-0">
                      View case study →
                    </ButtonLink>
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </div>
      ) : null}

      {overlayId === "automationSystems" ? (
        <div className="flex flex-wrap gap-2">
          {automationSkills.length === 0 ? (
            <EmptyState message="Automation and systems skills will appear here." />
          ) : (
            automationSkills.map((skill) => <Badge key={skill.label}>{skill.label}</Badge>)
          )}
        </div>
      ) : null}
    </BaseOverlay>
  );
}
