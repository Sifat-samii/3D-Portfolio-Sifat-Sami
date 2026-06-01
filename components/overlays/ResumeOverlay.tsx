"use client";

import { profile } from "@/data/profile";
import { Card } from "@/components/ui/Card";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

export function ResumeOverlay({ onClose }: { onClose: () => void }) {
  return (
    <BaseOverlay title="Resume" subtitle="A resume download or embedded PDF can be connected here later." onClose={onClose}>
      <Card>
        <p className="text-lg font-semibold">{profile.title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Placeholder resume area for product management, software projects, creative work, events, academics, and
          professional experience.
        </p>
        <div className="mt-5">
          <a
            href={profile.resumeUrl}
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/15"
          >
            Open resume link
          </a>
        </div>
      </Card>
    </BaseOverlay>
  );
}
