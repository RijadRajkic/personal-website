"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { getActiveNavKey, navItems } from "@/lib/navigation";

export default function SiteHeader() {
 const pathname = usePathname();
 const activeKey = getActiveNavKey(pathname);
 const [open, setOpen] = useState(false);

 const closeMenu = useCallback(() => setOpen(false), []);

 return (
  <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-bg)/85 backdrop-blur-lg">
   <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
    <Link href="/" className="text-xl font-bold tracking-tight text-(--color-text) md:text-2xl">
     Rijad Rajkic
    </Link>

    {/* Desktop nav */}
    <nav className="hidden items-center gap-7 md:flex">
     {navItems.map((item) => {
      const isActive = item.key === activeKey;
      return (
       <Link
        key={item.key}
        href={item.href}
        className={`nav-link text-sm font-semibold uppercase tracking-[0.08em] transition ${
         isActive ? "text-(--color-brand)" : "text-(--color-text-muted) hover:text-(--color-text)"
        }`}
       >
        {item.label}
       </Link>
      );
     })}
    </nav>

    {/* Mobile toggle */}
    <button
     type="button"
     className="inline-flex rounded-md border border-(--color-border) p-2 text-(--color-text) md:hidden"
     onClick={() => setOpen((v) => !v)}
     aria-label="Toggle navigation"
     aria-expanded={open}
    >
     {open ? (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
     ) : (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
     )}
    </button>
   </div>

   {/* Mobile menu */}
   {open ? (
    <nav className="border-t border-(--color-border) bg-(--color-bg) px-5 py-4 md:hidden">
     <div className="mx-auto flex max-w-6xl flex-col gap-2">
      {navItems.map((item) => (
       <Link
        key={item.key}
        href={item.href}
        className="rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-(--color-text-muted) hover:bg-(--color-surface) hover:text-(--color-text)"
        onClick={closeMenu}
       >
        {item.label}
       </Link>
      ))}
     </div>
    </nav>
   ) : null}
  </header>
 );
}
