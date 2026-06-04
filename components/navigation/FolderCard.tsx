"use client";

import { Link } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";
import { HERO_CARD_ATTR, useFolderGlow, useFolderHero } from "./FolderStack";

type TransitionRole = "rising" | "settling" | null;
// Outlives the longest reorder duration (backward = 1400ms) plus a safety
// margin, so the rise/settle keyframe always finishes before we strip the
// data attribute.
const TRANSITION_ROLE_LINGER_MS = 1550;

export type FolderTone = "evergreen" | "lavender" | "copper" | "lava";

/** Shared layout constants so the parent can compute stack dimensions */
export const FOLDER_LAYOUT = {
 /** Vertical gap between adjacent card tops in the peek-stack. Bumped from 64
  * so each peek gets a bit more breathing room above the next card's tab. */
 peekGap: 80,
 /** Tab height. Tab is positioned ABOVE the wrapper (negative top) so it visually
  * sticks up out of the body, like a paper folder tab. */
 tabH: 24,
 /** Card body height — the wrapper height. Used in every state. */
 bodyHeight: "clamp(380px, 55vh, 580px)",
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
 /** Override the default title/description/detail block rendered in the peek state */
 lead?: React.ReactNode;
 /**
  * If set, clicking this card toggles it as the hero of the stack (reorder
  * animation) instead of navigating. The id is the registry key.
  */
 heroToggleId?: string;
 /** Content rendered when this card is at the hero position (front-most) */
 heroContent?: React.ReactNode;
 /** Render extra content at the bottom-right of the card body (peek mode only) */
 children?: React.ReactNode;
 /**
  * Shared `view-transition-name` for the home↔inner morph. When set, the
  * card body advertises this name so the browser can pair it with the
  * matching inner-page element during a View Transition. Pure DOM metadata
  * — no effect on layout or rendering at rest.
  */
 viewTransitionName?: string;
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
 lead,
 heroToggleId,
 heroContent,
 children,
 viewTransitionName,
}: FolderCardProps) {
 const s = toneStyles[tone];
 const notifyGlow = useFolderGlow();
 const { heroId, setHeroId, registerCard, getDisplayIndex, reorderDirection } = useFolderHero();

 // Self-register so the stack can compute getDisplayIndex consistently for every card.
 // Use index as the registry key when heroToggleId isn't set so non-expandable cards
 // still participate in the displayIndex computation.
 const registryId = heroToggleId ?? `__static-${index}`;
 useEffect(() => {
  registerCard(registryId, index, tone);
 }, [registryId, index, tone, registerCard]);

 const { peekGap, tabH, bodyHeight } = FOLDER_LAYOUT;
 const displayIndex = getDisplayIndex(registryId, index);
 const isHero = displayIndex === total - 1;
 const isMeHero = heroToggleId !== undefined && heroId === heroToggleId;

 // Track displayIndex changes — but only the focal cards get a keyframe:
 //   - rising  : any card becoming the hero (visible at the new front)
 //   - settling: only TOGGLEABLE cards leaving the hero. The natural-hero
 //               (projects) leaving in the forward direction is covered by
 //               the rising contact card the whole way down, so its lift
 //               adds nothing — gate by heroToggleId so it doesn't fire.
 //   - other shifts: no keyframe, just the wrapper's `top` transition.
 const previousDisplayIndexRef = useRef(displayIndex);
 const [transitionRole, setTransitionRole] = useState<TransitionRole>(null);
 useEffect(() => {
  const prev = previousDisplayIndexRef.current;
  if (prev === displayIndex) return;
  const wasHero = prev === total - 1;
  const isNowHero = displayIndex === total - 1;
  let role: TransitionRole = null;
  if (!wasHero && isNowHero) role = "rising";
  else if (wasHero && !isNowHero && heroToggleId) role = "settling";
  previousDisplayIndexRef.current = displayIndex;
  if (role === null) return;
  setTransitionRole(role);
  const t = setTimeout(() => setTransitionRole(null), TRANSITION_ROLE_LINGER_MS);
  return () => clearTimeout(t);
 }, [displayIndex, total, heroToggleId]);

 const top = `${displayIndex * peekGap}px`;
 const height = bodyHeight;
 const zIndex = displayIndex + 1;

 // Stagger tabs right-to-left, but anchor them further inside the card so they
 // read as part of the folder rather than floating off the right edge. Use
 // displayIndex so each tab moves with its card during the reorder.
 const tabRight = 4 + displayIndex * 2.5; // rem

 // Hover-lift always on for non-toggleable cards (Link navigation cards) and for
 // toggleable cards when they're NOT the current hero. When the user has activated
 // this card as the hero, the lift would fight the surface they're trying to read
 // (e.g. fill out the form), so disable it.
 const hoverClasses = isMeHero ? "" : "hover-lift hover-lift-xl hover-group";

 const toggleHero = () => {
  if (!heroToggleId) return;
  setHeroId(isMeHero ? null : heroToggleId);
 };

 // Static peek ↔ hero swap. The wrapper's slide + the lift keyframe carry
 // the motion; animating the text underneath produced a ghosted overlap.
 const layerBase = "absolute inset-0";
 const visibleLayer = "opacity-100";
 const hiddenLayer = "pointer-events-none opacity-0";

 const defaultLeadInner = lead ?? (
  <>
   <h2 className="text-lg font-bold tracking-tight text-(--color-text) md:text-xl lg:text-2xl">{title}</h2>
   <p className="folder-peek-extra mt-1 max-w-lg text-xs text-(--color-text-muted) md:text-sm">{description}</p>
   {detail && <p className={`folder-peek-extra mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${s.accent}`}>{detail}</p>}
  </>
 );

 // Peek layer (default content). Click-to-toggle for cards with heroToggleId,
 // <Link> navigation for everything else.
 const renderPeekLayer = (visible: boolean) => {
  const padding = "px-5 pt-5 pb-5 md:px-8 md:pt-6 md:pb-6 lg:px-10";
  const inner = <div className={`h-full ${padding}`}>{defaultLeadInner}</div>;

  if (heroToggleId) {
   return (
    <button
     type="button"
     onClick={toggleHero}
     aria-label={`Bring ${title} to the front`}
     aria-hidden={!visible}
     tabIndex={visible ? 0 : -1}
     className={`${layerBase} block w-full cursor-pointer text-left focus:outline-none ${
      visible ? visibleLayer : hiddenLayer
     }`}
    >
     {inner}
    </button>
   );
  }
  return (
   <Link
    href={href}
    className={`${layerBase} ${visible ? visibleLayer : hiddenLayer} group`}
    aria-label={title}
    aria-hidden={!visible}
    tabIndex={visible ? undefined : -1}
   >
    {inner}
   </Link>
  );
 };

 // Hero layer — fully interactive (no whole-card click handler). Form fields,
 // method links, and the branding block live inside.
 const renderHeroLayer = (visible: boolean) => {
  if (!heroContent) return null;
  return (
   <div
    className={`${layerBase} ${visible ? visibleLayer : hiddenLayer}`}
    aria-hidden={!visible}
   >
    <div className="h-full px-5 pt-5 pb-5 md:px-8 md:pt-6 md:pb-6 lg:px-10">{heroContent}</div>
   </div>
  );
 };

 // Mark the wrapper of the hero (when it's a heroToggleId card) so the
 // click-outside handler in FolderStack can identify it.
 const heroAttr = isMeHero ? { [HERO_CARD_ATTR]: heroToggleId } : {};
 const transitionAttr = transitionRole ? { "data-transition-role": transitionRole } : {};

 return (
  <div
   className={`folder-card-wrapper folder-reorder-transition absolute left-0 right-0 ${
    reorderDirection === "backward" ? "folder-reorder-backward" : ""
   } ${hoverClasses}`}
   style={{ top, height, zIndex }}
   onMouseEnter={() => notifyGlow(tone)}
   onMouseLeave={() => notifyGlow(null)}
   {...heroAttr}
   {...transitionAttr}
  >
   {/* Inner shell carries the entry animation so it can't fight the wrapper's hover transform. */}
   <div className="folder-card-enter relative h-full" style={{ "--folder-stagger": index } as React.CSSProperties}>
    {/* Shuffle layer — picks up the rise / settle keyframe when the wrapper has
     * data-transition-role set. Lives on its own element so the transform
     * doesn't fight the entry keyframe (.folder-card-enter) or the wrapper's
     * hover-lift transform (.hover-lift). */}
    <div className="folder-card-shuffle relative h-full">
     {/* ── Card Body — fills the entire wrapper. ── */}
     <div
      className={`folder-card-body overflow-hidden border ${s.bg} ${s.border} rounded-[2.5rem]`}
      style={{
       position: "absolute",
       inset: 0,
       viewTransitionName,
      }}
     >
      {renderPeekLayer(!isHero || !heroContent)}
      {renderHeroLayer(isHero && !!heroContent)}

      {/* Children slot (peek-mode only): bottom-right corner */}
      {children && !isHero && (
       <div className="pointer-events-none absolute bottom-5 right-5 md:bottom-6 md:right-8 lg:right-10">
        <div className="pointer-events-auto">{children}</div>
       </div>
      )}
     </div>

     {/* ── Tab — sits above the body wrapper, like a folder tab. Click target for heroToggleId cards. ── */}
     {heroToggleId ? (
      <button
       type="button"
       onClick={toggleHero}
       aria-label={`Bring ${title} to the front`}
       className={`absolute z-10 flex h-6 w-fit cursor-pointer items-center rounded-t-xl px-4 text-[0.55rem] font-bold uppercase tracking-[0.25em] focus:outline-none ${s.tab}`}
       style={{ top: `-${tabH}px`, right: `${tabRight}rem` }}
      >
       {label}
      </button>
     ) : (
      <div
       className={`pointer-events-none absolute z-10 flex h-6 w-fit items-center rounded-t-xl px-4 text-[0.55rem] font-bold uppercase tracking-[0.25em] ${s.tab}`}
       style={{ top: `-${tabH}px`, right: `${tabRight}rem` }}
      >
       {label}
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
