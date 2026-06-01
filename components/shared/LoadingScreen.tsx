"use client";

import { motion, useReducedMotion } from "framer-motion";

export function LoadingScreen() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950 text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(34,211,238,0.10), transparent 40rem), radial-gradient(circle at 80% 80%, rgba(255,184,77,0.08), transparent 36rem)",
        }}
      />
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        className="relative rounded-3xl border border-white/[0.08] bg-white/[0.04] px-8 py-6 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur"
      >
        <div className="flex justify-center">
          <motion.div
            className="h-1 w-12 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.9), transparent)",
            }}
            animate={shouldReduceMotion ? undefined : { x: ["-20%", "20%", "-20%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.42em] text-cyan-300">
          Loading world
        </p>
        <p className="mt-2 text-lg font-semibold tracking-tight">Preparing the portfolio house</p>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/40">
          Lighting • Atmosphere • Identity
        </p>
      </motion.div>
    </motion.div>
  );
}
