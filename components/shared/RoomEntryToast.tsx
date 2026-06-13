"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { roomById } from "@/lib/roomConfig";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import type { RoomId } from "@/types/portfolio";

export function RoomEntryToast() {
  const currentRoom = usePortfolioStore((state) => state.currentRoom);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed left-1/2 top-20 z-30 hidden -translate-x-1/2 md:block"
    >
      <ToastBanner key={currentRoom} roomId={currentRoom} />
    </div>
  );
}

function ToastBanner({ roomId }: { roomId: RoomId }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), 2400);
    return () => window.clearTimeout(id);
  }, []);

  const room = roomById[roomId];

  return (
    <AnimatePresence mode="wait">
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 36 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="h-[2px] rounded-full"
            style={{ background: room.accentColor }}
          />
          <motion.p
            initial={{ letterSpacing: "0.4em", opacity: 0 }}
            animate={{ letterSpacing: "0.35em", opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="mt-3 text-[10px] font-semibold uppercase text-white/70"
            style={{ color: room.accentColor }}
          >
            Now entering
          </motion.p>
          <motion.h2
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mt-2 text-3xl font-black uppercase tracking-[0.18em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.7)]"
          >
            {room.label}
          </motion.h2>
          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="mt-1 text-xs uppercase tracking-[0.3em] text-white/55"
          >
            {room.tagline}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
