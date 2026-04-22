"use client";

import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { useInView } from "@/lib/animations";
import { useFolderGlow } from "./FolderStack";

export type FolderTone = "evergreen" | "lavender" | "copper" | "lava";

/** Shared layout constants so the parent can compute stack dimensions */
export const FOLDER_LAYOUT = {
 peekGap: 64,
 tabH: 24,
} as const;

interface FolderCardProps {
 href: string;
 label: string;
 title: string;
 description: string;
 detail?: string;
 tone?: FolderTone;
 index: number;
 total: number;
 /** Render extra content at the bottom of the card body (e.g. hero branding, teasers). */
 children?: React.ReactNode;
}

const toneStyles: Record<FolderTone, { tab: string; bg: string; border: string; accent: string }> = {
 evergreen: {
  tab: "bg-evergreen-700 text-evergreen-100",
  bg: "bg-evergreen-900",
  border: "border-evergreen-700/30",
  accent: "text-evergreen-400",
 },
 lavender: {
  tab: "bg-dusty-lavender-700 text-dusty-lavender-100",
  bg: "bg-dusty-lavender-900",
  border: "border-dusty-lavender-700/30",
  accent: "text-dusty-lavender-300",
 },
 copper: {
  tab: "bg-copper-700 text-copper-100",
  bg: "bg-copper-900",
  border: "border-copper-700/30",
  accent: "text-copper-400",
 },
 lava: {
  tab: "bg-molten-lava-700 text-molten-lava-100",
  bg: "bg-molten-lava-900",
  border: "border-molten-lava-700/30",
  accent: "text-molten-lava-400",
 },
};

export default function FolderCard({
 href,
 label,
 title,
 description,
 detail,
 tone = "evergreen",
 index,
 total,
 children,
}: FolderCardProps) {
 const s = toneStyles[tone];
 const [entered, setEntered] = useState(false);
 const [painted, setPainted] = useState(false);
 const notifyGlow = useFolderGlow();
 const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

 useEffect(() => {
  const id = requestAnimationFrame(() => {
   requestAnimationFrame(() => setPainted(true));
  });
  return () => cancelAnimationFrame(id);
 }, []);

 useEffect(() => {
  if (painted && inView && !entered) {
   const delayMs = index * 0.12 * 1000;
   const durationMs = 800;
   const timer = setTimeout(() => setEntered(true), delayMs + durationMs + 50);
   return () => clearTimeout(timer);
  }
 }, [painted, inView, entered, index]);

 const { peekGap } = FOLDER_LAYOUT;
 const top = index * peekGap;

 const canHoverLift = entered;
 const tabRight = 1.5 + index * 2.5;

 const bodyClasses = `folder-card-body relative overflow-hidden rounded-3xl border ${s.bg} ${s.border}`;

 return (
  <div
   ref={inViewRef}
   className={[
    "absolute left-0 right-0",
    !entered ? "animate fade-up" : "",
    !entered && painted && inView ? "in-view" : "",
    canHoverLift ? "hover-group" : "",
   ]
    .filter(Boolean)
    .join(" ")}
   style={
    {
     top: `${top}px`,
     zIndex: index + 1,
     ...(!entered && {
      "--animate-delay": `${index * 0.12}s`,
      "--animate-duration": "0.8s",
      "--animate-distance": "80px",
      "--animate-easing": "cubic-bezier(0.16, 1, 0.3, 1)",
     }),
    } as React.CSSProperties
   }
   onMouseEnter={() => notifyGlow(tone)}
   onMouseLeave={() => notifyGlow(null)}
  >
   <div className={canHoverLift ? "hover-target hover-lift-xl" : ""}>
    <div
     className={`ml-auto w-fit rounded-t-xl px-4 py-1 text-[0.55rem] font-bold uppercase tracking-[0.25em] ${s.tab}`}
     style={{ marginRight: `${tabRight}rem` }}
    >
     {label}
    </div>

    <div
     className={bodyClasses}
     style={{ height: "clamp(340px, 45vh, 520px)" }}
    >
     <Link href={href} className="group block h-full">
      <div className="relative z-10 px-5 pt-5 pb-5 md:px-8 md:pt-6 md:pb-6 lg:px-10">
       <h2 className="text-lg font-bold tracking-tight text-(--color-text) md:text-xl lg:text-2xl">{title}</h2>
       <p className="mt-1 max-w-lg text-xs text-(--color-text-muted) md:text-sm">{description}</p>
       {detail && <p className={`mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${s.accent}`}>{detail}</p>}
      </div>
     </Link>

     {children && (
      <div className="pointer-events-none absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-6 lg:inset-x-10">
       {children}
      </div>
     )}
    </div>
   </div>
  </div>
 );
}

