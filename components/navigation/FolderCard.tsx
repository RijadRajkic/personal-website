"use client";

import { Link } from "next-view-transitions";
import { useFolderGlow } from "./FolderStack";

export type FolderTone = "evergreen" | "lavender" | "copper" | "lava";

/** Shared layout constants so the parent can compute stack dimensions */
export const FOLDER_LAYOUT = {
 peekGap: 64,
 tabH: 24,
 /** Base card height — actual height uses clamp(340px, 45vh, 520px) via CSS */
 cardHeightEstimate: 420,
} as const;

interface FolderCardProps {
 href: string;
 label: string;
 title: string;
 description: string;
 detail?: string;
 tone?: FolderTone;
 index: number;
 /** Render extra content at the bottom-right of the card body */
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
 children,
}: FolderCardProps) {
 const s = toneStyles[tone];
 const notifyGlow = useFolderGlow();

 const { peekGap } = FOLDER_LAYOUT;
 const top = index * peekGap;

 // Stagger tabs right-to-left — avoids blocking title text on overlapping cards
 const tabRight = 1.5 + index * 2.5; // rem

 return (
  <div
   className="folder-card-wrapper absolute left-0 right-0 hover-lift hover-lift-xl hover-group"
   style={{
    top: `${top}px`,
    zIndex: index + 1,
   }}
   onMouseEnter={() => notifyGlow(tone)}
   onMouseLeave={() => notifyGlow(null)}
  >
   {/* Inner shell carries the entry animation so it can't fight the wrapper's hover transform. */}
   <div className="folder-card-enter" style={{ "--folder-stagger": index } as React.CSSProperties}>
    {/* ── Tab ── */}
    <div
     className={`ml-auto w-fit rounded-t-xl px-4 py-1 text-[0.55rem] font-bold uppercase tracking-[0.25em] ${s.tab}`}
     style={{ marginRight: `${tabRight}rem` }}
    >
     {label}
    </div>

    {/* ── Card Body — fully rounded, fixed height ── */}
    <div
     className={`folder-card-body relative overflow-hidden rounded-3xl border ${s.bg} ${s.border}`}
     style={{
      height: "clamp(340px, 45vh, 520px)",
     }}
    >
     {/* Navigable area — wrapped in Link */}
     <Link href={href} className="group block h-full">
      <div className="px-5 pt-5 pb-5 md:px-8 md:pt-6 md:pb-6 lg:px-10">
       <h2 className="text-lg font-bold tracking-tight text-(--color-text) md:text-xl lg:text-2xl">{title}</h2>
       <p className="mt-1 max-w-lg text-xs text-(--color-text-muted) md:text-sm">{description}</p>
       {detail && <p className={`mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${s.accent}`}>{detail}</p>}
      </div>
     </Link>

     {/* ── Slot for extra content — bottom-right of the card ── */}
     {children && <div className="absolute bottom-5 right-5 md:bottom-6 md:right-8 lg:right-10">{children}</div>}
    </div>
   </div>
  </div>
 );
}
