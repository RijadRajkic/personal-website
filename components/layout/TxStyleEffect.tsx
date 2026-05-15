"use client";

import { useEffect } from "react";

const VALID_MODES = ["morph", "layered", "subtle"] as const;
type TxMode = (typeof VALID_MODES)[number];

/**
 * Dev-only mode override for the View Transitions style. Reads `?tx=` once
 * on mount and stamps `<html data-tx="...">` so CSS branches kick in. The
 * default ("morph") is set inline on the html element in app/layout.tsx so
 * the morph rules apply through SSR and the initial paint without flicker;
 * this effect only flips the attribute when an explicit dev override is on
 * the URL.
 */
export default function TxStyleEffect() {
 useEffect(() => {
  if (typeof window === "undefined") return;
  const raw = new URLSearchParams(window.location.search).get("tx");
  if (!raw) return;
  if ((VALID_MODES as readonly string[]).includes(raw)) {
   document.documentElement.dataset.tx = raw as TxMode;
  }
 }, []);
 return null;
}
