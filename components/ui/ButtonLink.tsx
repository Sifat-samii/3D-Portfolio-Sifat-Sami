import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  external?: boolean;
};

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

function isPlaceholderHref(href: string) {
  return href === "#" || href === "";
}

export function ButtonLink({
  children,
  className,
  href,
  variant = "primary",
  external,
  ...props
}: ButtonLinkProps) {
  const isExternal = external ?? isExternalHref(href);
  const isPlaceholder = isPlaceholderHref(href);

  const styles = cx(
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
    variant === "primary"
      ? "border border-white/15 bg-white/10 text-white shadow-[0_10px_30px_-10px_rgba(34,211,238,0.45)] hover:-translate-y-px hover:border-cyan-300/50 hover:bg-cyan-300/15"
      : "border border-transparent bg-transparent text-white/75 hover:text-white",
    isPlaceholder && "pointer-events-none cursor-not-allowed opacity-50",
    className,
  );

  if (isPlaceholder) {
    return (
      <span className={styles} aria-disabled="true" title="Link coming soon">
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={styles}
      {...props}
    >
      {children}
    </a>
  );
}
