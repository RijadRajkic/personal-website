import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";

interface SectionHeadingProps {
 eyebrow?: string;
 title: string;
 description?: ReactNode;
 align?: "left" | "center";
 className?: string;
}

export default function SectionHeading({
 eyebrow,
 title,
 description,
 align = "left",
 className = "",
}: SectionHeadingProps) {
 const alignClasses = align === "center" ? "text-center items-center" : "text-left items-start";

 return (
  <div className={`mb-12 flex flex-col gap-4 ${alignClasses} ${className}`}>
   {eyebrow ? <Badge>{eyebrow}</Badge> : null}
   <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">{title}</h2>
   {description ? <p className="max-w-2xl text-base text-(--color-text-muted) md:text-lg">{description}</p> : null}
  </div>
 );
}
