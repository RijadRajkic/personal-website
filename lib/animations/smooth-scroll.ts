/**
 * Custom smooth scroll with eased animation.
 *
 * Uses `requestAnimationFrame` with an easeInOutCubic curve for a
 * polished, controlled scroll that feels better than the browser's
 * native `scroll-behavior: smooth`.
 *
 * Accounts for the sticky navbar offset via `scroll-padding-top` or
 * an explicit `offset` parameter.
 */

/** Easing — fast start, smooth deceleration */
function easeInOutCubic(t: number): number {
 return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export interface SmoothScrollOptions {
 /** Duration in ms (default: 900) */
 duration?: number;
 /** Fixed pixel offset from top — defaults to CSS scroll-padding-top or 88px */
 offset?: number;
}

/**
 * Smoothly scroll to a target element with a custom easing curve.
 *
 * @param target - The element to scroll to, or its ID string.
 * @param options - Duration and offset overrides.
 */
export function smoothScrollTo(target: HTMLElement | string, options: SmoothScrollOptions = {}): void {
 const el = typeof target === "string" ? document.getElementById(target) : target;
 if (!el) return;

 const { duration = 900 } = options;

 // Read scroll-padding-top from <html> or fall back to 88px (5.5rem)
 const offset = options.offset ?? (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 88);

 const start = window.scrollY;
 const targetY = el.getBoundingClientRect().top + window.scrollY - offset;
 const distance = targetY - start;

 // Nothing to scroll
 if (Math.abs(distance) < 1) return;

 let startTime: number | null = null;

 function step(timestamp: number) {
  if (startTime === null) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / duration, 1);
  const eased = easeInOutCubic(progress);

  window.scrollTo(0, start + distance * eased);

  if (progress < 1) {
   requestAnimationFrame(step);
  }
 }

 requestAnimationFrame(step);
}
