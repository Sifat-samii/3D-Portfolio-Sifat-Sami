import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cx(
        "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.06]",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}
