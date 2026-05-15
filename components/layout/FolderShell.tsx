"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
 folderNavItems,
 getActiveFolder,
 type FolderTone,
} from "@/lib/navigation";
import FolderTabs from "./FolderTabs";
import MobileDock from "./MobileDock";

const TONE_BODY_VAR: Record<FolderTone, string> = {
 evergreen: "var(--tone-evergreen-body)",
 copper: "var(--tone-copper-body)",
 lavender: "var(--tone-lavender-body)",
 cream: "var(--tone-cream-body)",
 lava: "var(--tone-lava-body)",
};
const TONE_ACCENT_VAR: Record<FolderTone, string> = {
 evergreen: "var(--color-evergreen-400)",
 copper: "var(--color-copper-400)",
 lavender: "var(--color-dusty-lavender-300)",
 cream: "var(--color-almond-cream-300)",
 lava: "var(--color-molten-lava-300)",
};

export default function FolderShell({ children }: { children: ReactNode }) {
 const pathname = usePathname();
 const activeKey = getActiveFolder(pathname);
 const activeItem = activeKey ? folderNavItems.find((f) => f.key === activeKey) ?? null : null;
 const tone: FolderTone = activeItem?.tone ?? "evergreen";

 const toneStyle: CSSProperties = {
  ["--tone-body" as string]: TONE_BODY_VAR[tone],
  ["--accent" as string]: TONE_ACCENT_VAR[tone],
 };

 return (
  <div
   className="folder-shell"
   data-tone={tone}
   data-active-folder={activeKey ?? "none"}
   style={toneStyle}
  >
   <FolderTabs activeKey={activeKey} />
   <main className="folder-shell-body">{children}</main>
   <MobileDock activeKey={activeKey} />
  </div>
 );
}
