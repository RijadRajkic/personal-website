"use client";

import { Link } from "next-view-transitions";
import { folderNavItems, type FolderKey } from "@/lib/navigation";

interface Props {
 activeKey: FolderKey | null;
}

export default function MobileDock({ activeKey }: Props) {
 return (
  <nav
   role="tablist"
   aria-label="Folder navigation"
   className="mobile-dock md:hidden"
  >
   {folderNavItems.map((f) => {
    const active = f.key === activeKey;
    return (
     <Link
      key={f.key}
      href={f.href}
      role="tab"
      aria-selected={active}
      data-tone={f.tone}
      data-active={active ? "true" : "false"}
      className="mobile-folder"
     >
      <span className="mini-tab" aria-hidden="true" />
      <span className="mini-body">{f.label}</span>
     </Link>
    );
   })}
  </nav>
 );
}
