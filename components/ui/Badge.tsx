import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/85 transition hover:border-white/[0.18] hover:bg-white/[0.09] hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
