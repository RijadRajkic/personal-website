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

type HoverCallback = (tone: FolderTone | null) => void;

const FolderGlowCtx = createContext<HoverCallback | null>(null);

/** Cards call this hook to notify the stack which tone is hovered */
export function useFolderGlow(): HoverCallback {
 const cb = useContext(FolderGlowCtx);
 // no-op fallback when used outside a FolderStack
 return cb ?? (() => {});
}

export default function FolderStack({ children }: { children: React.ReactNode }) {
 const [hoveredTone, setHoveredTone] = useState<FolderTone | null>(null);

 const handleHoverChange = useCallback((tone: FolderTone | null) => {
  setHoveredTone(tone);
 }, []);

 const glowRgb = hoveredTone ? glowColors[hoveredTone] : null;

 return (
  <FolderGlowCtx.Provider value={handleHoverChange}>
   {/* Full-page glow overlay */}
   <div
    className="pointer-events-none fixed inset-0"
    style={{
     zIndex: 0,
     background: glowRgb
      ? [
         `radial-gradient(ellipse 120% 90% at 50% 25%, rgba(${glowRgb}, 0.38), rgba(${glowRgb}, 0.15) 50%, rgba(${glowRgb}, 0.04) 75%, transparent 90%)`,
        ].join(", ")
      : "transparent",
     opacity: glowRgb ? 1 : 0,
     transition: "background 0.5s ease, opacity 0.5s ease",
    }}
    aria-hidden
   />
   {children}
  </FolderGlowCtx.Provider>
 );
}
