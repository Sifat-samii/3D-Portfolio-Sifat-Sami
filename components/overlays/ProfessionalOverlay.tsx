"use client";

import type { OverlayId } from "@/types/portfolio";
import { experience } from "@/data/experience";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

const titles: Partial<Record<OverlayId, string>> = {
  careerTimeline: "Career Timeline",
  professionalImpact: "Achievements & Impact",
  professionalCaseStudies: "Professional Case Studies",
  workflowSystems: "Workflow Systems",
};

export function ProfessionalOverlay({ overlayId, onClose }: { overlayId: OverlayId; onClose: () => void }) {
  const accent = getOverlayAccent(overlayId);

  return (
    <BaseOverlay
      title={titles[overlayId] ?? "Professional Work"}
      subtitle="Product and project management, production automation, operations, and measurable outcomes."
      accentColor={accent}
      onClose={onClose}
    >
      {experience.length === 0 ? (
        <EmptyState />
      ) : (
        experience.map((item) => (
          <Card key={`${item.company}-${item.role}`} className="mb-4 last:mb-0">
            <SectionLabel accentColor={accent}>{item.company}</SectionLabel>
            <h3 className="mt-2 text-xl font-semibold">{item.role}</h3>
            <p className="mt-1 text-sm text-slate-400">{item.duration}</p>

            {overlayId === "careerTimeline" ? (
              <p className="mt-4 text-sm text-slate-300">
                Timeline view for roles, transitions, and scope across organizations.
              </p>
            ) : null}

            {overlayId === "workflowSystems" ? (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {item.responsibilities.map((responsibility, index) => (
                  <li key={`${overlayId}-resp-${index}`}>{responsibility}</li>
                ))}
              </ul>
            ) : null}

            {overlayId === "professionalCaseStudies" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.achievements.map((metric, index) => (
                  <Badge key={`${overlayId}-achievement-${index}`}>{metric}</Badge>
                ))}
              </div>
            ) : null}

            {overlayId === "professionalImpact" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.impactMetrics.map((metric, index) => (
                  <Badge key={`${overlayId}-impact-${index}`}>{metric}</Badge>
                ))}
              </div>
            ) : null}
          </Card>
        ))
      )}
    </BaseOverlay>
  );
}
