"use client";

import type { OverlayId } from "@/types/portfolio";
import { academics } from "@/data/academics";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

const titles: Partial<Record<OverlayId, string>> = {
  certifications: "Certifications",
  researchPublication: "Research & Publication",
  academicBackground: "Academic Background",
};

export function AcademicsOverlay({ overlayId, onClose }: { overlayId: OverlayId; onClose: () => void }) {
  return (
    <BaseOverlay
      title={titles[overlayId] ?? "Academics"}
      subtitle="Education, research, certifications, publications, and academic goals."
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
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Research</p>
          <p className="mt-2 text-sm text-slate-300">{academics.thesis}</p>
          <p className="mt-2 text-sm text-slate-300">{academics.publication}</p>
        </Card>
      ) : null}

      {overlayId === "academicBackground" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Degree</p>
            <p className="mt-2 text-xl font-semibold">{academics.degree}</p>
            <p className="mt-2 text-sm text-slate-300">{academics.university}</p>
          </Card>
          <Card>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Achievements</p>
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
