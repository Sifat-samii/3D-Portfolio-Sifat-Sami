"use client";

import { contact } from "@/data/contact";
import { profile } from "@/data/profile";
import { Card } from "@/components/ui/Card";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

function contactHref(label: string, value: string) {
  if (label === "Email") return `mailto:${value}`;
  return value;
}

export function ContactOverlay({ onClose }: { onClose: () => void }) {
  const rows: Array<[string, string]> = [
    ["Email", contact.email],
    ["LinkedIn", contact.linkedin],
    ["GitHub", contact.github],
    ["Website", contact.website],
  ];

  return (
    <BaseOverlay title="Contact Corner" subtitle={contact.callToAction} onClose={onClose}>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <Card key={label}>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{label}</p>
            <a
              href={contactHref(label, value)}
              rel="noopener noreferrer"
              className="mt-2 block break-words text-sm text-slate-200 underline-offset-2 hover:text-cyan-300 hover:underline"
            >
              {value}
            </a>
          </Card>
        ))}
      </div>
      <div className="mt-5">
        <a
          href={profile.resumeUrl}
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/15"
        >
          Open resume
        </a>
      </div>
    </BaseOverlay>
  );
}
