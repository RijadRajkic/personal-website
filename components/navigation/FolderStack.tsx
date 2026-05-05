"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
 return cb ?? (() => {});
}

interface RegisteredCard {
 defaultIndex: number;
 tone: FolderTone;
}

/**
 * Direction of the most recent reorder. Cards apply a different transition
 * duration based on this so the "close" animation feels slower and more
 * legible than the "open" — without it, returning to the default order
 * reads as a flicker.
 */
export type ReorderDirection = "forward" | "backward";

interface HeroState {
 /** id of the card the user has selected as the hero, or null for default order */
 heroId: string | null;
 setHeroId: (id: string | null) => void;
 /**
  * Self-registration so the stack knows each expandable/orderable card's
  * default array index and tone. Non-expandable cards register too — their
  * defaultIndex still matters for the displayIndex shift.
  */
 registerCard: (id: string, defaultIndex: number, tone: FolderTone) => void;
 /**
  * Compute the position the card should display at for the current hero state.
  * In default state this matches defaultIndex. When a hero is selected, the
  * hero takes the last position and everything between the hero's default
  * index and the last index shifts up by one.
  */
 getDisplayIndex: (cardId: string, defaultIndex: number) => number;
 /** Direction of the most recent state change — cards key timing off this. */
 reorderDirection: ReorderDirection;
}

const FolderHeroCtx = createContext<HeroState | null>(null);

export function useFolderHero(): HeroState {
 const ctx = useContext(FolderHeroCtx);
 return (
  ctx ?? {
   heroId: null,
   setHeroId: () => {},
   registerCard: () => {},
   getDisplayIndex: (_id, def) => def,
   reorderDirection: "forward",
  }
 );
}

interface FolderStackProps {
 children: React.ReactNode;
 /** Optional initial hero (e.g. from ?contact=open) */
 initialHeroId?: string | null;
}

export const HERO_CARD_ATTR = "data-hero-card";

export default function FolderStack({ children, initialHeroId = null }: FolderStackProps) {
 const [hoveredTone, setHoveredTone] = useState<FolderTone | null>(null);
 const [heroId, setHeroIdState] = useState<string | null>(initialHeroId);
 const [registry, setRegistry] = useState<Map<string, RegisteredCard>>(new Map());
 // Direction of the most recent reorder. Cards apply a longer "backward"
 // transition for the return-to-default so it doesn't feel like a flicker.
 const [reorderDirection, setReorderDirection] = useState<ReorderDirection>("forward");

 const handleHoverChange = useCallback((tone: FolderTone | null) => {
  setHoveredTone(tone);
 }, []);

 const setHeroId = useCallback((id: string | null) => {
  // forward: null → some id; backward: any id → null. id-to-id swaps stay forward.
  setReorderDirection(id === null ? "backward" : "forward");
  setHeroIdState(id);
 }, []);

 const registerCard = useCallback((id: string, defaultIndex: number, tone: FolderTone) => {
  setRegistry((prev) => {
   const existing = prev.get(id);
   if (existing && existing.defaultIndex === defaultIndex && existing.tone === tone) return prev;
   const next = new Map(prev);
   next.set(id, { defaultIndex, tone });
   return next;
  });
 }, []);

 // Display-index shift formula: when the user picks a non-last card to be the
 // hero, the hero moves to the last position and the cards between the hero's
 // default index and the last position shift up by one.
 const getDisplayIndex = useCallback(
  (cardId: string, defaultIndex: number): number => {
   if (heroId === null) return defaultIndex;
   const heroEntry = registry.get(heroId);
   if (!heroEntry) return defaultIndex;
   // The "last position" is determined by the registry — whichever defaultIndex is highest.
   const lastIndex = Math.max(...Array.from(registry.values()).map((c) => c.defaultIndex));
   if (heroEntry.defaultIndex === lastIndex) return defaultIndex; // hero is already at last; no shift
   if (cardId === heroId) return lastIndex;
   if (defaultIndex > heroEntry.defaultIndex && defaultIndex <= lastIndex) {
    return defaultIndex - 1;
   }
   return defaultIndex;
  },
  [heroId, registry],
 );

 const heroEntry = heroId !== null ? (registry.get(heroId) ?? null) : null;
 const heroTone = heroEntry?.tone ?? null;

 // Escape key reverts to default order
 useEffect(() => {
  if (heroId === null) return;
  const onKey = (e: KeyboardEvent) => {
   if (e.key === "Escape") setHeroId(null);
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
 }, [heroId, setHeroId]);

 // Click anywhere outside the hero card body reverts
 useEffect(() => {
  if (heroId === null) return;
  const onClick = (e: MouseEvent) => {
   const target = e.target as HTMLElement | null;
   if (!target) return;
   const heroRoot = target.closest<HTMLElement>(`[${HERO_CARD_ATTR}="${heroId}"]`);
   if (!heroRoot) {
    setHeroId(null);
   }
  };
  // Defer attaching so the click that picked the hero doesn't immediately revert
  const id = window.setTimeout(() => {
   document.addEventListener("click", onClick);
  }, 0);
  return () => {
   window.clearTimeout(id);
   document.removeEventListener("click", onClick);
  };
 }, [heroId, setHeroId]);

 // Glow tone: explicit hero wins, otherwise hovered card
 const activeTone = heroTone ?? hoveredTone;
 const glowRgb = activeTone ? glowColors[activeTone] : null;

 return (
  <FolderGlowCtx.Provider value={handleHoverChange}>
   <FolderHeroCtx.Provider value={{ heroId, setHeroId, registerCard, getDisplayIndex, reorderDirection }}>
    {/* Full-page glow overlay */}
    <div
     className="pointer-events-none fixed inset-0"
     style={{
      zIndex: 0,
      background: glowRgb
       ? `radial-gradient(ellipse 120% 90% at 50% 25%, rgba(${glowRgb}, 0.38), rgba(${glowRgb}, 0.15) 50%, rgba(${glowRgb}, 0.04) 75%, transparent 90%)`
       : "transparent",
      opacity: glowRgb ? 1 : 0,
      transition: "background 0.5s ease, opacity 0.5s ease",
     }}
     aria-hidden
    />
    {children}
   </FolderHeroCtx.Provider>
  </FolderGlowCtx.Provider>
 );
}
