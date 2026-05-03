"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface UseCursorTrackerOptions {
 /**
  * Whether cursor tracking is active. When false, listeners are detached.
  * Useful for gating by responsive state or feature flags.
  */
 enabled?: boolean;
 /**
  * Smoothing factor between 0 (instant) and 1 (never catches up).
  * Uses a simple linear interpolation on each animation frame.
  */
 smoothing?: number;
 /**
  * Whether to reset the CSS variables to centered on pointer leave.
  * When false, the last cursor position is retained.
  */
 resetOnLeave?: boolean;
}

/**
 * Tracks pointer position relative to the returned ref element and writes
 * CSS variables directly to its style. No React re-renders occur.
 *
 * Variables written (on the element):
 *   --cursor-x   — 0 (left)  → 1 (right)
 *   --cursor-y   — 0 (top)   → 1 (bottom)
 *   --cursor-cx  — -1 (left) → 1 (right)   (centered)
 *   --cursor-cy  — -1 (top)  → 1 (bottom)  (centered)
 *   --cursor-active — 0 when pointer is outside, 1 when inside
 *
 * Pair with CSS primitives `.hover-tilt`, `.hover-spotlight`, or
 * `.parallax-layer` that read these variables.
 */
export function useCursorTracker<T extends HTMLElement = HTMLElement>(
 options: UseCursorTrackerOptions = {},
): RefObject<T> {
 const { enabled = true, smoothing = 0.18, resetOnLeave = true } = options;
 const ref = useRef<T>(null) as RefObject<T>;

 useEffect(() => {
  const node = ref.current;
  if (!node || !enabled) return;

  let rafId = 0;
  // Target and current values; we lerp current → target each frame.
  const target = { x: 0.5, y: 0.5, active: 0 };
  const current = { x: 0.5, y: 0.5, active: 0 };

  const write = () => {
   const s = node.style;
   s.setProperty("--cursor-x", current.x.toFixed(4));
   s.setProperty("--cursor-y", current.y.toFixed(4));
   s.setProperty("--cursor-cx", (current.x * 2 - 1).toFixed(4));
   s.setProperty("--cursor-cy", (current.y * 2 - 1).toFixed(4));
   s.setProperty("--cursor-active", current.active.toFixed(3));
  };

  const tick = () => {
   const t = 1 - Math.min(Math.max(smoothing, 0), 0.95);
   current.x += (target.x - current.x) * t;
   current.y += (target.y - current.y) * t;
   current.active += (target.active - current.active) * t;
   write();

   const settled =
    Math.abs(target.x - current.x) < 0.0005 &&
    Math.abs(target.y - current.y) < 0.0005 &&
    Math.abs(target.active - current.active) < 0.005;
   if (!settled) rafId = requestAnimationFrame(tick);
   else rafId = 0;
  };

  const schedule = () => {
   if (rafId === 0) rafId = requestAnimationFrame(tick);
  };

  const handleMove = (event: PointerEvent) => {
   const rect = node.getBoundingClientRect();
   if (rect.width === 0 || rect.height === 0) return;
   target.x = (event.clientX - rect.left) / rect.width;
   target.y = (event.clientY - rect.top) / rect.height;
   target.active = 1;
   schedule();
  };

  const handleEnter = () => {
   target.active = 1;
   schedule();
  };

  const handleLeave = () => {
   if (resetOnLeave) {
    target.x = 0.5;
    target.y = 0.5;
   }
   target.active = 0;
   schedule();
  };

  // Seed initial values so CSS reading them doesn't see "undefined".
  write();

  node.addEventListener("pointermove", handleMove, { passive: true });
  node.addEventListener("pointerenter", handleEnter, { passive: true });
  node.addEventListener("pointerleave", handleLeave, { passive: true });

  return () => {
   node.removeEventListener("pointermove", handleMove);
   node.removeEventListener("pointerenter", handleEnter);
   node.removeEventListener("pointerleave", handleLeave);
   if (rafId) cancelAnimationFrame(rafId);
  };
 }, [enabled, smoothing, resetOnLeave]);

 return ref;
}
