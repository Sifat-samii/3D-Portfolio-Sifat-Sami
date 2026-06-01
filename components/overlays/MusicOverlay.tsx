"use client";

import type { OverlayId } from "@/types/portfolio";
import { music } from "@/data/music";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

const titles: Partial<Record<OverlayId, string>> = {
  musicProfile: "Music Profile",
  bandProjects: "Band & Projects",
  audioPreview: "Audio Preview",
};

export function MusicOverlay({ overlayId, onClose }: { overlayId: OverlayId; onClose: () => void }) {
  return (
    <BaseOverlay title={titles[overlayId] ?? "Music"} subtitle={music.intro} onClose={onClose}>
      {overlayId === "musicProfile" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300">Role</p>
            <p className="mt-2 text-xl font-semibold">{music.role}</p>
            <p className="mt-2 text-sm text-slate-300">{music.bandName}</p>
          </Card>
          <Card>
            <p className="text-sm uppercase tracking-[0.25em] text-rose-300">Links</p>
            <div className="mt-3 flex flex-col gap-2">
              {music.links.length === 0 ? (
                <EmptyState />
              ) : (
                music.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-300 underline-offset-2 hover:underline"
                  >
                    {link.label}
                  </a>
                ))
              )}
            </div>
          </Card>
        </div>
      ) : null}

      {overlayId === "bandProjects" ? (
        <div className="flex flex-wrap gap-2">
          {[...music.releases, ...music.performances].length === 0 ? (
            <EmptyState />
          ) : (
            [...music.releases, ...music.performances].map((item, index) => (
              <Badge key={`${overlayId}-${item}-${index}`}>{item}</Badge>
            ))
          )}
        </div>
      ) : null}

      {overlayId === "audioPreview" ? (
        <Card>
          <p className="text-sm uppercase tracking-[0.25em] text-rose-300">Future Audio</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Audio previews are intentionally placeholders in Phase 1. A lightweight audio system can be added later.
          </p>
        </Card>
      ) : null}
    </BaseOverlay>
  );
}
