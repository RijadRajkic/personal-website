"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** Options for the `useInView` intersection observer hook. */
export interface UseInViewOptions {
 /** Fraction of the element that must be visible (0–1). Default `0.2`. */
 threshold?: number;
 /** Root margin string (same as IntersectionObserver). Default `"0px"`. */
 rootMargin?: string;
 /** Fire only once, then disconnect. Default `true`. */
 once?: boolean;
}

/**
 * Lightweight `IntersectionObserver` hook.
 *
 * Returns a `ref` to attach and an `inView` boolean.
 * When `once` is true (default), the observer disconnects after the
 * first intersection and `inView` stays `true` permanently.
 *
 * @example
 * ```tsx
 * const { ref, inView } = useInView({ threshold: 0.25 });
 * return <div ref={ref} className={inView ? "in-view" : ""}>…</div>;
 * ```
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
 options: UseInViewOptions = {},
): { ref: RefObject<T>; inView: boolean } {
 const { threshold = 0.2, rootMargin = "0px", once = true } = options;
 const ref = useRef<T>(null) as RefObject<T>;
 const [inView, setInView] = useState(false);

 useEffect(() => {
  const node = ref.current;
  if (!node) return;

  const observer = new IntersectionObserver(
   ([entry]) => {
    if (entry.isIntersecting) {
     setInView(true);
     if (once) observer.disconnect();
    } else if (!once) {
     setInView(false);
    }
   },
   { threshold, rootMargin },
  );

  observer.observe(node);
  return () => observer.disconnect();
 }, [threshold, rootMargin, once]);

 return { ref, inView };
}
