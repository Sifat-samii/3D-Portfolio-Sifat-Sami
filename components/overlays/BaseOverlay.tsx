"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, type ReactNode } from "react";

type BaseOverlayProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  accentColor?: string;
};

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function BaseOverlay({
  title,
  subtitle,
  children,
  onClose,
  accentColor = "#67e8f9",
}: BaseOverlayProps) {
  const subtitleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-40 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
    >
      <button
        type="button"
        aria-label="Close overlay backdrop"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <motion.section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-overlay-title"
        aria-describedby={subtitle ? subtitleId : undefined}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-950/95 text-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
        initial={shouldReduceMotion ? false : { y: 24, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { y: 16, scale: 0.98, opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: accentColor }}
        />
        <div
          className="pointer-events-none absolute -right-32 -bottom-32 h-72 w-72 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: accentColor }}
        />

        <div className="relative max-h-[88vh] overflow-y-auto p-7 md:p-9">
          <div className="flex items-start justify-between gap-5">
            <div className="flex-1">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.32em]"
                style={{ color: accentColor }}
              >
                Portfolio
              </p>
              <h2
                id="portfolio-overlay-title"
                className="mt-2 text-3xl font-black leading-tight tracking-tight md:text-4xl"
              >
                {title}
              </h2>
              {subtitle ? (
                <p id={subtitleId} className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close overlay"
              onClick={onClose}
              className="group relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition group-hover:rotate-90"
                aria-hidden
              >
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="mt-7">{children}</div>
        </div>
      </motion.section>
    </motion.div>
  );
}
