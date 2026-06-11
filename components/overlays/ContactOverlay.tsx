"use client";

import { contact } from "@/data/contact";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

function contactHref(label: string, value: string) {
  if (label === "Email") return `mailto:${value}`;
  return value;
}

function isExternalLink(label: string) {
  return label !== "Email";
}

export function ContactOverlay({ onClose }: { onClose: () => void }) {
  const accent = getOverlayAccent("contact");
  const rows: Array<[string, string]> = [
    ["Email", contact.email],
    ["LinkedIn", contact.linkedin],
    ["GitHub", contact.github],
    ["Website", contact.website],
  ];

  return (
    <BaseOverlay title="Contact Corner" subtitle={contact.callToAction} accentColor={accent} onClose={onClose}>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <Card key={label}>
            <SectionLabel accentColor={accent}>{label}</SectionLabel>
            <a
              href={contactHref(label, value)}
              target={isExternalLink(label) ? "_blank" : undefined}
              rel={isExternalLink(label) ? "noopener noreferrer" : undefined}
              className="mt-2 block break-words text-sm text-slate-200 underline-offset-2 transition hover:text-cyan-300 hover:underline"
            >
              {value}
            </a>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <ButtonLink href={contact.resumeUrl}>Open resume</ButtonLink>
      </div>
    </BaseOverlay>
  );
}
