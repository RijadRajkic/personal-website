import type { ReactNode } from "react";

interface BadgeProps {
 children: ReactNode;
 className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
 return (
  <span
   className={`inline-flex items-center rounded-full border border-(--color-border)/70 bg-(--color-surface) px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-text-muted) ${className}`}
  >
   {children}
  </span>
 );
}
