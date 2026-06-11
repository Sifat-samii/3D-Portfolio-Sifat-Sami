"use client";

import type { OverlayId } from "@/types/portfolio";
import { music } from "@/data/music";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

const titles: Partial<Record<OverlayId, string>> = {
  musicProfile: "Music Profile",
  bandProjects: "Band & Projects",
  audioPreview: "Audio Preview",
  guitarJourney: music.guitarJourney.title,
  performances: music.performanceVideos.title,
};

export function MusicOverlay({ overlayId, onClose }: { overlayId: OverlayId; onClose: () => void }) {
  const accent = getOverlayAccent(overlayId);

  return (
    <BaseOverlay
      title={titles[overlayId] ?? "Music"}
      subtitle={music.intro}
      accentColor={accent}
      onClose={onClose}
    >
      {overlayId === "musicProfile" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <SectionLabel accentColor={accent}>Role</SectionLabel>
            <p className="mt-2 text-xl font-semibold">{music.role}</p>
            <p className="mt-2 text-sm text-slate-300">{music.bandName}</p>
          </Card>
          <Card>
            <SectionLabel accentColor={accent}>Links</SectionLabel>
            <div className="mt-3 flex flex-col gap-2">
              {music.links.length === 0 ? (
                <EmptyState />
              ) : (
                music.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
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
          <SectionLabel accentColor={accent}>Future Audio</SectionLabel>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Audio previews are intentionally placeholders in Phase 1. A lightweight audio system can be added later.
          </p>
        </Card>
      ) : null}

      {overlayId === "guitarJourney" ? (
        <div className="space-y-4">
          <Card>
            <p className="text-sm leading-7 text-slate-300">{music.guitarJourney.summary}</p>
          </Card>
          <div className="grid gap-3">
            {music.guitarJourney.milestones.map((milestone) => (
              <Card key={milestone.title}>
                <SectionLabel accentColor={accent}>{milestone.year}</SectionLabel>
                <p className="mt-2 font-semibold text-white">{milestone.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{milestone.detail}</p>
              </Card>
            ))}
          </div>
          <Card>
            <SectionLabel accentColor={accent}>Gear</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {music.guitarJourney.gear.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </Card>
        </div>
      ) : null}

      {overlayId === "performances" ? (
        <div className="space-y-4">
          <Card>
            <p className="text-sm leading-7 text-slate-300">{music.performanceVideos.summary}</p>
          </Card>
          <div className="grid gap-3">
            {music.performanceVideos.items.map((item) => (
              <Card key={item.title}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </div>
                  <Badge>{item.platform}</Badge>
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium underline-offset-2 hover:underline"
                  style={{ color: accent }}
                >
                  Watch video
                </a>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </BaseOverlay>
  );
}
