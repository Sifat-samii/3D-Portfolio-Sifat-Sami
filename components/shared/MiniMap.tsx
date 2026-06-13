"use client";

import { motion } from "framer-motion";
import { rooms } from "@/lib/roomConfig";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const MAP_SIZE = 196;
const PADDING = 22;

const xs = rooms.map((room) => room.position[0]);
const zs = rooms.map((room) => room.position[2]);
const MAP_BOUNDS = {
  minX: Math.min(...xs),
  maxX: Math.max(...xs),
  minZ: Math.min(...zs),
  maxZ: Math.max(...zs),
  rangeX: Math.max(1, Math.max(...xs) - Math.min(...xs)),
  rangeZ: Math.max(1, Math.max(...zs) - Math.min(...zs)),
};

function projectRoom(positionX: number, positionZ: number) {
  const usable = MAP_SIZE - PADDING * 2;
  return {
    x: PADDING + ((positionX - MAP_BOUNDS.minX) / MAP_BOUNDS.rangeX) * usable,
    y: PADDING + ((positionZ - MAP_BOUNDS.minZ) / MAP_BOUNDS.rangeZ) * usable,
  };
}

export function MiniMap() {
  const currentRoom = usePortfolioStore((state) => state.currentRoom);

  return (
    <motion.aside
      aria-label={`Room map. Currently in ${rooms.find((r) => r.id === currentRoom)?.label ?? "unknown room"}.`}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="fixed right-5 top-5 z-30 hidden overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl md:block"
    >
      <div className="flex items-center justify-between gap-6">
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/55">Map</p>
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
          {rooms.findIndex((r) => r.id === currentRoom) + 1}/{rooms.length}
        </p>
      </div>
      <div
        className="relative mt-3 overflow-hidden rounded-xl border border-white/[0.07] bg-slate-950/60"
        style={{ width: MAP_SIZE, height: MAP_SIZE }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <svg
          width={MAP_SIZE}
          height={MAP_SIZE}
          className="absolute inset-0"
          aria-hidden="true"
        >
          {rooms
            .filter((r) => r.id !== "living")
            .map((room) => {
              const a = projectRoom(0, 0);
              const b = projectRoom(room.position[0], room.position[2]);
              return (
                <line
                  key={`line-${room.id}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="3 3"
                />
              );
            })}
        </svg>
        {rooms.map((room) => {
          const { x, y } = projectRoom(room.position[0], room.position[2]);
          const isCurrent = room.id === currentRoom;
          return (
            <div
              key={room.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
              title={room.label}
            >
              <div
                className="relative rounded-md transition-all"
                style={{
                  width: isCurrent ? 18 : 12,
                  height: isCurrent ? 18 : 12,
                  background: isCurrent ? room.accentColor : "rgba(255,255,255,0.18)",
                  boxShadow: isCurrent ? `0 0 14px ${room.accentColor}` : "none",
                }}
              >
                {isCurrent ? (
                  <motion.div
                    className="absolute inset-0 rounded-md"
                    style={{ border: `1.5px solid ${room.accentColor}` }}
                    animate={{ scale: [1, 1.5, 1.8], opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-white/65">
        {rooms.find((r) => r.id === currentRoom)?.label}
      </p>
    </motion.aside>
  );
}
