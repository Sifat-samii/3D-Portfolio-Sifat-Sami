import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  accentColor?: string;
};

export function SectionLabel({ children, accentColor = "#67e8f9" }: SectionLabelProps) {
  return (
    <p
      className="text-[10px] font-semibold uppercase tracking-[0.28em]"
      style={{ color: accentColor }}
    >
      {children}
    </p>
  );
}
