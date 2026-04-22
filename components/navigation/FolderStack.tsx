"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { FolderTone } from "./FolderCard";

/** Glow colors per tone — RGB values for the full-page radial gradient */
const glowColors: Record<FolderTone, string> = {
 evergreen: "86, 196, 152",
 lavender: "190, 155, 175",
 copper: "192, 147, 90",
 lava: "232, 113, 91",
};

const TONES = Object.keys(glowColors) as FolderTone[];

type HoverCallback = (tone: FolderTone | null) => void;

const FolderGlowCtx = createContext<HoverCallback | null>(null);

/** Cards call this hook to notify the stack which tone is hovered */
export function useFolderGlow(): HoverCallback {
 const cb = useContext(FolderGlowCtx);
 return cb ?? (() => {});
}

function glowGradient(rgb: string): string {
 return `radial-gradient(ellipse 120% 90% at 50% 25%, rgba(${rgb}, 0.38), rgba(${rgb}, 0.15) 50%, rgba(${rgb}, 0.04) 75%, transparent 90%)`;
}

export default function FolderStack({ children }: { children: React.ReactNode }) {
 const [hoveredTone, setHoveredTone] = useState<FolderTone | null>(null);

 const handleHoverChange = useCallback((tone: FolderTone | null) => {
  setHoveredTone(tone);
 }, []);

 return (
  <FolderGlowCtx.Provider value={handleHoverChange}>
   {/* One pre-rendered layer per tone — only `opacity` transitions (GPU-only). */}
   {TONES.map((tone) => (
    <div
     key={tone}
     className="pointer-events-none fixed inset-0"
     style={{
      zIndex: 0,
      background: glowGradient(glowColors[tone]),
      opacity: hoveredTone === tone ? 1 : 0,
      transition: "opacity 0.5s ease",
      willChange: "opacity",
     }}
     aria-hidden
    />
   ))}
   {children}
  </FolderGlowCtx.Provider>
 );
}
