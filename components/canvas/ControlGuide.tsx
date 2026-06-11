"use client";

import { motion } from "framer-motion";
import { roomById } from "@/lib/roomConfig";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const KEYS: Array<{ keys: string[]; description: string }> = [
  { keys: ["W", "A", "S", "D"], description: "Move" },
  { keys: ["E"], description: "Interact" },
  { keys: ["Esc"], description: "Close" },
  { keys: ["Shift"], description: "Sprint" },
];

export function ControlGuide() {
  const currentRoom = usePortfolioStore((state) => state.currentRoom);
  const room = roomById[currentRoom];

  return (
    <motion.aside
      aria-label="Controls and current room"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="fixed left-5 top-5 z-30 hidden w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl md:block"
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${room.accentColor}, transparent)` }}
      />
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: room.accentColor, boxShadow: `0 0 12px ${room.accentColor}` }}
        />
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/55">Current room</p>
      </div>
      <p className="mt-1.5 text-lg font-semibold text-white">{room.label}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.22em] text-white/45">{room.tagline}</p>

      <div className="mt-4 h-px w-full bg-white/[0.06]" />

      <div className="mt-3 grid gap-2">
        {KEYS.map((entry) => (
          <div key={entry.description} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              {entry.keys.map((key) => (
                <kbd
                  key={key}
                  className="grid h-6 min-w-6 place-items-center rounded-md border border-white/15 bg-white/[0.06] px-1.5 font-mono text-[10px] font-semibold text-white/85"
                >
                  {key}
                </kbd>
              ))}
            </div>
            <span className="text-xs text-white/65">{entry.description}</span>
          </div>
        ))}
      </div>
    </motion.aside>
  );
}
