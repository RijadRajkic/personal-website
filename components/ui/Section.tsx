import type { ReactNode } from "react";
import Container from "@/components/ui/Container";

type SectionTone = "default" | "surface" | "brand" | "accent";

interface SectionProps {
 children: ReactNode;
 id?: string;
 className?: string;
 tone?: SectionTone;
 padded?: boolean;
}

const toneClasses: Record<SectionTone, string> = {
 default: "bg-transparent",
 surface: "bg-(--color-surface)/70",
 brand: "tone-brand bg-evergreen-700 text-(--color-text)",
 accent: "tone-accent bg-dusty-lavender-800 text-(--color-text)",
};

export default function Section({ children, id, className = "", tone = "default", padded = true }: SectionProps) {
 return (
  <section id={id} className={`${toneClasses[tone]} ${padded ? "py-20 md:py-28" : ""} ${className}`}>
   <Container>{children}</Container>
  </section>
 );
}
