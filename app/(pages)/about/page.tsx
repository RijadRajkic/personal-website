import type { Metadata } from "next";
import { Link } from "next-view-transitions";

export const metadata: Metadata = {
 title: "About",
 description:
  "Rijad Rajkic — software engineer based in Sarajevo. Full-stack web with TypeScript, React, and Next.js.",
};

interface QuickFactProps {
 label: string;
 lines: string[];
}

function QuickFact({ label, lines }: QuickFactProps) {
 return (
  <div>
   <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-(--accent)">
    {label}
   </div>
   {lines.map((line) => (
    <div key={line} className="text-sm leading-relaxed text-(--color-text)">
     {line}
    </div>
   ))}
  </div>
 );
}

const QUICK_FACTS: QuickFactProps[] = [
 { label: "Currently", lines: ["Sarajevo, Bosnia", "Building ShelfSync"] },
 { label: "Stack", lines: ["TypeScript · React · Next.js", "Node.js · Postgres · Notion API"] },
 { label: "Reading", lines: ["A Pattern Language,", "Christopher Alexander"] },
 { label: "Listening", lines: ["Khruangbin, Bonobo,", "lots of Brian Eno"] },
];

const linkInline =
 "border-b border-(--color-border-strong) text-(--color-text) transition hover:border-(--accent) hover:text-(--accent)";

export default function AboutPage() {
 return (
  <article className="mx-auto max-w-[980px] px-6 pt-14 pb-24 md:px-16 md:pt-20 md:pb-28">
   <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--accent)">
    <span
     className="h-1.5 w-1.5 rounded-full bg-(--accent)"
     aria-hidden
    />
    About
   </div>

   <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-(--color-text) md:text-5xl lg:text-6xl">
    A bit about me.
   </h1>

   <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-(--color-text-muted) md:text-xl">
    I&apos;m Rijad — a software engineer based in Sarajevo. I build full-stack web applications, mostly with TypeScript,
    React, and Next.js. Some days I write Go on the backend. Most days I&apos;m just trying to make software that&apos;s
    quiet, considered, and gets out of the way.
   </p>

   <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[minmax(0,1fr)_220px]">
    <div className="space-y-5 text-base leading-relaxed text-(--color-text-muted) md:text-lg">
     <p>
      Most of my work right now centers on a setup I genuinely love: Next.js on the front, a Notion database as the CMS.
      It means I can edit a blog post on my phone, drag a project card into a different order, and the site updates
      without me opening a code editor.
     </p>

     <h2 className="!mt-12 !mb-3 text-2xl font-bold tracking-[-0.01em] text-(--color-text)">How I work</h2>
     <p>
      I take the engineer-first part of my job seriously. That means caring about how a product is built, not just what
      it looks like at the end — small bundle sizes, sensible defaults, fast loads, an interface that feels considered
      everywhere you touch it.
     </p>
     <p>
      I also draw, sketch, and design when I need to. Not because I&apos;m pretending to be a designer, but because the
      best engineers I know can pick up a pencil.{" "}
      <strong className="text-(--color-text)">Engineer first, designer when needed.</strong>
     </p>

     <h2 className="!mt-12 !mb-3 text-2xl font-bold tracking-[-0.01em] text-(--color-text)">
      What I&apos;m currently into
     </h2>
     <p>
      React Server Components — the mental shift, not the syntax. CSS that does the work animation libraries used to.
      Long-form writing as a way to figure out what I actually think. Bread, but only the kind that takes 24 hours.
     </p>

     <h2 className="!mt-12 !mb-3 text-2xl font-bold tracking-[-0.01em] text-(--color-text)">How to find me</h2>
     <p>
      The quickest path is the{" "}
      <Link href="/?contact=open" className={linkInline}>
       contact drawer
      </Link>{" "}
      — name, email, message, done. I read every one. If you&apos;d rather see what I&apos;m making, my{" "}
      <Link href="/projects" className={linkInline}>
       projects
      </Link>{" "}
      live a click away.
     </p>
    </div>

    <aside className="space-y-6 self-start md:sticky md:top-24">
     {QUICK_FACTS.map((fact) => (
      <QuickFact key={fact.label} label={fact.label} lines={fact.lines} />
     ))}
    </aside>
   </div>
  </article>
 );
}
