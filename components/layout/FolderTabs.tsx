"use client";

import Link from "next/link";
import { folderNavItems, type FolderKey } from "@/lib/navigation";

interface Props {
 activeKey: FolderKey | null;
}

export default function FolderTabs({ activeKey }: Props) {
 return (
  <header className="folder-tabs hidden md:flex">
   <Link href="/" aria-label="Back to home" className="folder-wordmark">
    <span className="stack-glyph" aria-hidden="true">
     <span />
     <span />
     <span />
    </span>
    Rijad Rajkic
   </Link>

   <nav role="tablist" aria-label="Folder navigation" className="folder-tab-row">
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
       className="folder-tab"
      >
       {f.label}
      </Link>
     );
    })}
   </nav>
  </header>
 );
}
