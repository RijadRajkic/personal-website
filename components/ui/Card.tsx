import type { ReactNode } from "react";

interface CardProps {
 children: ReactNode;
 className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
 return (
  <div
   className={`rounded-3xl border border-(--color-border) bg-(--color-surface)/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg md:p-8 ${className}`}
  >
   {children}
  </div>
 );
}
