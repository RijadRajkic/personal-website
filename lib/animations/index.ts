/**
 * Animation library — public API
 *
 * Re-exports the CSS class names as constants and the `useInView` hook
 * so consumers get a single import path.
 *
 * ## Scroll-triggered entrance
 *
 * ```tsx
 * import { useInView, anim } from "@/lib/animations";
 *
 * function MyComponent() {
 *   const { ref, inView } = useInView({ threshold: 0.15 });
 *   return (
 *     <div ref={ref} className={anim("fade-up", { inView })}>
 *       Hello
 *     </div>
 *   );
 * }
 * ```
 *
 * ## Hover interactions (pure CSS, GPU-only)
 *
 * Self-triggered:
 * ```tsx
 * <div className="hover-lift hover-lift-md">…</div>
 * <div className="hover-scale hover-scale-sm">…</div>
 * ```
 *
 * Group-triggered (parent drives child — useful when hit-zone ≠ animated element):
 * ```tsx
 * <div className="hover-group">
 *   <div className="hover-target hover-lift-lg">…</div>
 * </div>
 * ```
 *
 * Distance presets for lift: `hover-lift-sm` (8px) · `hover-lift-md` (16px)
 * · `hover-lift-lg` (32px) · `hover-lift-xl` (48px).
 *
 * Scale presets: `hover-scale-sm` (1.02) · `hover-scale-md` (1.03) · `hover-scale-lg` (1.05).
 *
 * Tune per-element via CSS vars: `--hover-distance`, `--hover-scale`,
 * `--hover-duration`, `--hover-easing`.
 *
 * Keyboard users also trigger hover-group interactions via `:focus-within`.
 *
 * ## Cursor-driven interactions (JS hook + CSS primitives)
 *
 * The `useCursorTracker` hook writes normalised cursor coordinates as CSS
 * variables (`--cursor-x/y`, `--cursor-cx/cy`, `--cursor-active`) onto the
 * element it ref's — no React re-renders. Pair with any of these classes:
 *
 * ```tsx
 * import { useCursorTracker } from "@/lib/animations";
 *
 * function HeroCard() {
 *   const ref = useCursorTracker<HTMLDivElement>();
 *   return (
 *     <div ref={ref} className="hover-tilt hover-spotlight">
 *       <h1 className="parallax-layer parallax-depth-md">Hello</h1>
 *       <p className="parallax-layer parallax-depth-sm">World</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * - `.hover-tilt` (size: `-sm|-md|-lg`) — 3D rotate toward the cursor.
 * - `.hover-spotlight` (size: `-sm|-md|-lg`) — soft radial glow follows cursor.
 * - `.parallax-layer` (depth: `-xs|-sm|-md|-lg|-xl`) — child drifts with cursor.
 *
 * Tune via `--tilt-strength`, `--spotlight-size`, `--spotlight-color`,
 * `--parallax-depth`, etc.
 */

export { useInView, type UseInViewOptions } from "./use-in-view";
export { useCursorTracker, type UseCursorTrackerOptions } from "./use-cursor-tracker";
export { smoothScrollTo, type SmoothScrollOptions } from "./smooth-scroll";

/* ---------------------------------------------------------------------------
 * Animation class helper
 *
 * Builds the CSS class string for an animated element.
 * Keeps component code clean and provides a single place to change
 * the naming convention if the CSS framework ever changes.
 * ------------------------------------------------------------------------ */

export type AnimationVariant =
 | "fade-up"
 | "fade-down"
 | "fade-left"
 | "fade-right"
 | "fade-in"
 | "scale-in"
 | "scale-up";

/** Keyframe-based variants — run once via @keyframes, then release transform */
export type KeyframeVariant = "kf-fade-up" | "kf-fade-down" | "kf-fade-in" | "kf-scale-up";

export type DurationModifier = "fast" | "default" | "slow" | "slower";
export type EasingModifier = "ease-out-expo" | "ease-out-quart" | "ease-out-back" | "ease-spring";

export interface AnimOptions {
 /** Whether the element is currently in view. */
 inView?: boolean;
 /** Stagger index (0-based). */
 stagger?: number;
 /** Duration modifier class. */
 duration?: DurationModifier;
 /** Easing modifier class. */
 easing?: EasingModifier;
 /** Extra classes to append. */
 className?: string;
}

/**
 * Build the complete class string for an animated element.
 *
 * @param variant - The animation type (`"fade-up"`, `"scale-in"`, etc.)
 * @param options - Optional modifiers and state.
 * @returns A space-separated class string.
 *
 * @example
 * anim("fade-up", { inView: true, stagger: 2 })
 * // → "animate fade-up in-view"
 */
export function anim(variant: AnimationVariant, options: AnimOptions = {}): string {
 const { inView, duration, easing, className } = options;

 const parts: string[] = ["animate", variant];

 if (inView) parts.push("in-view");
 if (duration && duration !== "default") parts.push(`duration-${duration}`);
 if (easing) parts.push(easing);
 if (className) parts.push(className);

 return parts.join(" ");
}
