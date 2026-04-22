/**
 * Shared low-level utility functions.
 */

/** Convert an arbitrary string into a URL-safe slug. */
export function slugify(value: string): string {
 return value
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-");
}
