import type { ReactNode } from "react";
import Card from "@/components/ui/Card";

interface AnimatedCardProps {
 children: ReactNode;
 className?: string;
 stagger?: number;
}

export default function AnimatedCard({ children, className, stagger }: AnimatedCardProps) {
 return (
  <div className="animate fade-up" {...(stagger != null ? { "data-stagger": stagger } : {})}>
   <Card className={`h-full ${className ?? ""}`}>{children}</Card>
  </div>
 );
}
