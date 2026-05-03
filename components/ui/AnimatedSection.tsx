"use client";

import type { ReactNode } from "react";
import Section from "@/components/ui/Section";
import { useInView } from "@/lib/animations";

type SectionTone = "default" | "surface" | "brand" | "accent";

interface AnimatedSectionProps {
 children: ReactNode;
 id?: string;
 tone?: SectionTone;
 padded?: boolean;
 className?: string;
 amount?: number;
}

export default function AnimatedSection({ children, id, tone, padded, className, amount = 0.2 }: AnimatedSectionProps) {
 const { ref, inView } = useInView({ threshold: amount });

 return (
  <Section id={id} tone={tone} padded={padded} className={className}>
   <div ref={ref} className={inView ? "in-view" : ""}>
    {children}
   </div>
  </Section>
 );
}
