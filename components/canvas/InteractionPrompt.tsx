"use client";

import { AnimatePresence, motion } from "framer-motion";
import { allDoors, allInteractiveObjects } from "@/lib/interactionConfig";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export function InteractionPrompt() {
  const nearbyDoor = usePortfolioStore((state) => state.nearbyDoor);
  const nearbyObject = usePortfolioStore((state) => state.nearbyObject);
  const isOverlayOpen = usePortfolioStore((state) => state.isOverlayOpen);
  const isTransitioning = usePortfolioStore((state) => state.isTransitioning);

  const door = nearbyDoor ? allDoors.find((item) => item.id === nearbyDoor) : null;
  const object = nearbyObject ? allInteractiveObjects.find((item) => item.id === nearbyObject) : null;

  const visible = !isOverlayOpen && !isTransitioning && (door || object);
  const accent = door?.accentColor ?? object?.accentColor ?? "#67e8f9";
  const verb = door ? "Enter" : "View";
  const label = door?.label ?? object?.label ?? "";
  const key = door ? `door-${door.id}` : object ? `object-${object.id}` : "";

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-30 hidden justify-center md:flex"
    >
      <AnimatePresence mode="wait">
        {visible ? (
          <motion.div
            key={key}
            initial={{ y: 16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-full border border-white/15 bg-slate-950/75 px-5 py-2.5 text-sm font-medium text-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur"
            style={{ boxShadow: `0 0 32px -8px ${accent}55, 0 18px 50px -12px rgba(0,0,0,0.65)` }}
          >
            <motion.kbd
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-7 min-w-7 place-items-center rounded-md border border-white/20 bg-white/[0.08] px-2 font-mono text-[11px] font-semibold"
              style={{ color: accent, borderColor: `${accent}66` }}
            >
              E
            </motion.kbd>
            <span className="text-white/85">
              {verb}{" "}
              <span className="font-semibold text-white" style={{ color: accent }}>
                {label}
              </span>
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
