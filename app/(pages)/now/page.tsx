import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Now",
 description: "What Rijad is up to right now — current work, reading, listening, thinking.",
};

// Hand-edit this when starting a new month, alongside the four paragraphs
// below. The page deliberately has no CMS — /now is a single-screen snapshot
// of right-now and is meant to be light to refresh in code.
const UPDATED = "May 2026";

export default function NowPage() {
 return (
  <article className="mx-auto max-w-[760px] px-6 pt-12 pb-24 md:px-14 md:pt-16 md:pb-32">
   <div className="now-sheet now-sheet-postcard relative">
    <div className="flex flex-wrap items-center justify-between gap-3">
     <div className="now-meta-row inline-flex items-center gap-3 font-mono text-xs text-(--color-almond-cream-200)">
      <span className="now-pulse-dot" aria-hidden />
      Updated {UPDATED}
     </div>
     <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-(--color-almond-cream-300)/55">
      From Sarajevo
     </div>
    </div>

    <h1 className="page-title mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-(--color-almond-cream-50) text-balance md:text-5xl">
     What I&apos;m up to right now.
    </h1>

    <div className="mt-7 max-w-[42ch] space-y-5 text-base leading-relaxed text-(--color-almond-cream-100)/90 md:text-lg">
     <p>
      On the side: I rebuilt this site. Notion as the CMS, Next.js App Router, and a small custom animation library so I
      could stop shipping Framer Motion. Writing about it as I go.
     </p>
     <p className="text-(--color-almond-cream-200)/70">
      [Hand-edit this section each month — what Rijad is currently working on, reading, listening to, thinking about.
      Keep it short, four paragraphs max. Voice should match the rest of the site.]
     </p>
    </div>

    <div className="mt-9 border-t border-dashed border-(--color-almond-cream-300)/25 pt-5 text-sm text-(--color-almond-cream-200)/60">
     Inspired by{" "}
     <a
      href="https://nownownow.com"
      target="_blank"
      rel="noopener noreferrer"
      className="border-b border-current text-(--color-almond-cream-100)"
     >
      nownownow.com
     </a>{" "}
     — a one-page snapshot of what someone is up to, refreshed every month or so. The opposite of a portfolio.
    </div>

    <span className="now-pin" aria-hidden>
     <span />
    </span>
   </div>
  </article>
 );
}
