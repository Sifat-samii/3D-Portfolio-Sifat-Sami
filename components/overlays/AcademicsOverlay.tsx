"use client";

import type { OverlayId } from "@/types/portfolio";
import { academics } from "@/data/academics";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

const titles: Partial<Record<OverlayId, string>> = {
  certifications: "Certifications",
  researchPublication: "Research & Publication",
  academicBackground: "Academic Background",
};

export function AcademicsOverlay({ overlayId, onClose }: { overlayId: OverlayId; onClose: () => void }) {
  const accent = getOverlayAccent(overlayId);

  return (
    <BaseOverlay
      title={titles[overlayId] ?? "Academics"}
      subtitle="Education, research, certifications, publications, and academic goals."
      accentColor={accent}
      onClose={onClose}
    >
      {overlayId === "certifications" ? (
        <div className="flex flex-wrap gap-2">
          {academics.certifications.length === 0 ? (
            <EmptyState />
          ) : (
            academics.certifications.map((item, index) => (
              <Badge key={`${overlayId}-cert-${index}`}>{item}</Badge>
            ))
          )}
        </div>
      ) : null}

      {overlayId === "researchPublication" ? (
        <Card>
          <SectionLabel accentColor={accent}>Research</SectionLabel>
          <p className="mt-2 text-sm text-slate-300">{academics.thesis}</p>
          <p className="mt-2 text-sm text-slate-300">{academics.publication}</p>
        </Card>
      ) : null}

      {overlayId === "academicBackground" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <SectionLabel accentColor={accent}>Degree</SectionLabel>
            <p className="mt-2 text-xl font-semibold">{academics.degree}</p>
            <p className="mt-2 text-sm text-slate-300">{academics.university}</p>
          </Card>
          <Card>
            <SectionLabel accentColor={accent}>Achievements</SectionLabel>
            {academics.achievements.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {academics.achievements.map((item, index) => (
                  <li key={`${overlayId}-achievement-${index}`}>{item}</li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : null}
    </BaseOverlay>
  );
}
