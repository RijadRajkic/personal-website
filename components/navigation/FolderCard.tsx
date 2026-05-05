"use client";

import { Link } from "next-view-transitions";
import { useEffect } from "react";
import { HERO_CARD_ATTR, useFolderGlow, useFolderHero } from "./FolderStack";

export type FolderTone = "evergreen" | "lavender" | "copper" | "lava";

/** Shared layout constants so the parent can compute stack dimensions */
export const FOLDER_LAYOUT = {
 /** Vertical gap between adjacent card tops in the peek-stack */
 peekGap: 64,
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
}: FolderCardProps) {
 const s = toneStyles[tone];
 const notifyGlow = useFolderGlow();
 const { heroId, setHeroId, registerCard, getDisplayIndex } = useFolderHero();

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

 const top = `${displayIndex * peekGap}px`;
 const height = bodyHeight;
 const zIndex = displayIndex + 1;

 // Stagger tabs right-to-left, but anchor them further inside the card so they
 // read as part of the folder rather than floating off the right edge. Use
 // displayIndex so each tab moves with its card during the reorder.
 const tabRight = 4 + displayIndex * 2.5; // rem

 // Hover lift active when the user CAN turn this card into the hero (heroToggleId set)
 // and isn't already at hero. Other cards keep the lift on default home view via Link.
 const hoverClasses = "hover-lift hover-lift-xl hover-group";

 const toggleHero = () => {
  if (!heroToggleId) return;
  setHeroId(isMeHero ? null : heroToggleId);
 };

 // Layer cross-fade (peek ↔ hero) — class lives in lib/animations.
 const layerBase = "folder-layer-fade absolute inset-0";
 const visibleLayer = "opacity-100";
 const hiddenLayer = "pointer-events-none opacity-0";

 const defaultLeadInner = lead ?? (
  <>
   <h2 className="text-lg font-bold tracking-tight text-(--color-text) md:text-xl lg:text-2xl">{title}</h2>
   <p className="mt-1 max-w-lg text-xs text-(--color-text-muted) md:text-sm">{description}</p>
   {detail && <p className={`mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${s.accent}`}>{detail}</p>}
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

 return (
  <div
   className={`folder-card-wrapper folder-reorder-transition absolute left-0 right-0 ${hoverClasses}`}
   style={{ top, height, zIndex }}
   onMouseEnter={() => notifyGlow(tone)}
   onMouseLeave={() => notifyGlow(null)}
   {...heroAttr}
  >
   {/* Inner shell carries the entry animation so it can't fight the wrapper's hover transform. */}
   <div className="folder-card-enter relative h-full" style={{ "--folder-stagger": index } as React.CSSProperties}>
    {/* ── Card Body — fills the entire wrapper. ── */}
    <div
     className={`folder-card-body overflow-hidden border ${s.bg} ${s.border} rounded-[2.5rem]`}
     style={{ position: "absolute", inset: 0 }}
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
 );
}
