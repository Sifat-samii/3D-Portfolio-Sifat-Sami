"use client";

import type { CSSProperties } from "react";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";
import { Card } from "@/components/ui/Card";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import type { OverlayId } from "@/types/portfolio";

type MusicTvMenuOverlayProps = {
  onClose: () => void;
};

const OPTIONS: Array<{ overlayId: OverlayId; title: string; description: string }> = [
  {
    overlayId: "guitarJourney",
    title: "My guitar journey",
    description: "Timeline, milestones, gear, and how my playing evolved.",
  },
  {
    overlayId: "performances",
    title: "Watch my performances",
    description: "Live sets, studio sessions, and video highlights.",
  },
];

export function MusicTvMenuOverlay({ onClose }: MusicTvMenuOverlayProps) {
  const accent = getOverlayAccent("musicTvMenu");
  const openOverlay = usePortfolioStore((state) => state.openOverlay);

  return (
    <BaseOverlay
      title="Music Room TV"
      subtitle="Choose what to explore on the big screen."
      accentColor={accent}
      onClose={onClose}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {OPTIONS.map((option) => (
          <button
            key={option.overlayId}
            type="button"
            onClick={() => openOverlay(option.overlayId)}
            className="group text-left transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            style={
              {
                "--tw-ring-color": accent,
              } as CSSProperties
            }
          >
            <Card className="h-full border-white/10 transition-colors group-hover:border-white/20 group-hover:bg-white/[0.06]">
              <p
                className="text-lg font-semibold tracking-tight"
                style={{ color: accent }}
              >
                {option.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{option.description}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                Press to open
              </p>
            </Card>
          </button>
        ))}
      </div>
    </BaseOverlay>
  );
}
