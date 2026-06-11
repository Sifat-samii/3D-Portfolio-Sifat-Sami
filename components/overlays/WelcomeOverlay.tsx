"use client";

import { profile } from "@/data/profile";
import { getOverlayAccent } from "@/lib/overlayTheme";
import { rooms } from "@/lib/roomConfig";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

export function WelcomeOverlay({ onClose }: { onClose: () => void }) {
  const accent = getOverlayAccent("welcome");

  return (
    <BaseOverlay
      title={profile.name}
      subtitle={profile.shortBio}
      accentColor={accent}
      onClose={onClose}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <SectionLabel accentColor={accent}>Role</SectionLabel>
          <p className="mt-2 text-xl font-semibold">{profile.title}</p>
          <p className="mt-1 text-sm text-white/50">{profile.location}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{profile.currentFocus}</p>
        </Card>
        <Card>
          <SectionLabel accentColor="#ffb84d">Explore</SectionLabel>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Move through the living room hub, approach glowing doors or objects, then press E to open each side of the
            portfolio.
          </p>
        </Card>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {rooms.map((room) => (
          <Badge key={room.id} style={{ borderColor: `${room.accentColor}44` }}>
            {room.label}
          </Badge>
        ))}
      </div>
    </BaseOverlay>
  );
}
