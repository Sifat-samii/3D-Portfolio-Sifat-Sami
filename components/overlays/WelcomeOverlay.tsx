"use client";

import { profile } from "@/data/profile";
import { rooms } from "@/lib/roomConfig";
import { Card } from "@/components/ui/Card";
import { BaseOverlay } from "@/components/overlays/BaseOverlay";

export function WelcomeOverlay({ onClose }: { onClose: () => void }) {
  return (
    <BaseOverlay title={profile.name} subtitle={profile.shortBio} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Role</p>
          <p className="mt-2 text-xl font-semibold">{profile.title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{profile.currentFocus}</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Explore</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Move through the living room hub, approach glowing doors or objects, then press E to open each side of the
            portfolio.
          </p>
        </Card>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {rooms.map((room) => (
          <span key={room.id} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
            {room.label}
          </span>
        ))}
      </div>
    </BaseOverlay>
  );
}
