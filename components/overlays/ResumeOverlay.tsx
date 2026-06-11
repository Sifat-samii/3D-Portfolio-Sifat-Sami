"use client";

import { profile } from "@/data/profile";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

export function ResumeOverlay({ onClose }: { onClose: () => void }) {
  const accent = getOverlayAccent("resume");

  return (
    <BaseOverlay
      title="Resume"
      subtitle="Download or view a summary of product, technical, creative, and professional experience."
      accentColor={accent}
      onClose={onClose}
    >
      <Card>
        <SectionLabel accentColor={accent}>Overview</SectionLabel>
        <p className="mt-2 text-lg font-semibold">{profile.title}</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          A resume PDF or embedded viewer can be connected here. Until then, explore each room for detailed case studies
          and project highlights.
        </p>
        <div className="mt-6">
          <ButtonLink href={profile.resumeUrl}>Open resume link</ButtonLink>
        </div>
      </Card>
    </BaseOverlay>
  );
}
