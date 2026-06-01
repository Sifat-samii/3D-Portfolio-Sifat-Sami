import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          ? "border border-white/15 bg-white/10 text-white shadow-[0_10px_30px_-10px_rgba(34,211,238,0.45)] hover:-translate-y-px hover:border-cyan-300/50 hover:bg-cyan-300/15"
          : "border border-transparent bg-transparent text-white/75 hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
