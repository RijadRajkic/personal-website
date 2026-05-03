import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import type { TechCategory, TimelineEntry } from "@/types/content";
import { SOCIAL_LINKS } from "@/lib/site-config";

export const metadata: Metadata = {
 title: "About",
 description:
  "Rijad Rajkic — full-stack developer specializing in TypeScript, React, and Next.js.",
};

const techStack: TechCategory[] = [
 {
  label: "Languages",
  items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
 },
 {
  label: "Frontend",
  items: ["React", "Next.js", "Tailwind CSS", "HTML/CSS", "React Native"],
 },
 {
  label: "Backend",
  items: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST APIs"],
 },
 {
  label: "Tools & Infra",
  items: ["Git", "Vercel", "Docker", "VS Code", "Notion API"],
 },
];

const timeline: TimelineEntry[] = [
 {
  year: "2026",
  title: "Portfolio rebuild",
  description:
   "Rebuilt personal website from scratch with Next.js App Router, Tailwind CSS v4, and a fully custom design system.",
 },
 {
  year: "2025",
  title: "Client & side projects",
  description:
   "Shipped Business by Bega (client brand site with Notion CMS), continued ShelfSync development, and built the Client Tab Manager browser extension.",
 },
 {
  year: "2024",
  title: "Enterprise UI work",
  description:
   "Built the Sila Frontend component library for a fintech application — theming system, accessible forms, and responsive layouts.",
 },
 {
  year: "2023",
  title: "Full-stack foundations",
  description:
   "Deepened expertise in TypeScript, Node.js, and PostgreSQL. Started contributing to open source and building developer tools.",
 },
];

export default function AboutPage() {
 return (
  <>
   {/* ───── Header ───── */}
   <AnimatedSection padded={false} className="pb-0 pt-24 md:pt-32">
    <SectionHeading
     eyebrow="About"
     title="A bit about me"
     description="I'm a full-stack developer who cares about clean code, accessible interfaces, and shipping things that work."
    />
   </AnimatedSection>

   {/* ───── Bio ───── */}
   <AnimatedSection amount={0.15}>
    <div className="mx-auto max-w-3xl space-y-6">
     <p className="animate fade-up text-base leading-relaxed text-(--color-text-muted) md:text-lg" data-stagger="0">
      I&apos;m Rijad Rajkic — a software engineer working primarily with TypeScript, React, and
      Next.js. I build full-stack web applications, developer tools, and the occasional browser
      extension. My focus is on performance, accessibility, and maintainable architecture.
     </p>
     <p className="animate fade-up text-base leading-relaxed text-(--color-text-muted) md:text-lg" data-stagger="1">
      I believe the best software is invisible — it does what users need without friction or
      confusion. That principle guides every decision, from choosing server components over client
      data-fetching to building a pure-CSS animation system instead of shipping a heavy runtime.
     </p>
     <p className="animate fade-up text-base leading-relaxed text-(--color-text-muted) md:text-lg" data-stagger="2">
      When I&apos;m not coding, I&apos;m usually reading, exploring new tools, or working on side
      projects that scratch an itch.
     </p>
    </div>
   </AnimatedSection>

   {/* ───── Tech Stack ───── */}
   <AnimatedSection tone="surface" amount={0.15}>
    <SectionHeading
     eyebrow="Stack"
     title="Technologies I work with"
    />

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
     {techStack.map((category, catIdx) => (
      <div
       key={category.label}
       className="animate fade-up"
       data-stagger={catIdx}
      >
       <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-(--color-text-muted)">
        {category.label}
       </h4>
       <div className="flex flex-wrap gap-2">
        {category.items.map((item) => (
         <Badge key={item}>{item}</Badge>
        ))}
       </div>
      </div>
     ))}
    </div>
   </AnimatedSection>

   {/* ───── Timeline ───── */}
   <AnimatedSection amount={0.1}>
    <SectionHeading
     eyebrow="Timeline"
     title="What I've been up to"
    />

    <div className="mx-auto max-w-3xl">
     <div className="relative space-y-10 border-l-2 border-(--color-border) pl-8">
      {timeline.map((entry, i) => (
       <div key={entry.year + entry.title} className="animate fade-up relative" data-stagger={i}>
        {/* Dot */}
        <div className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-(--color-brand)" />

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-brand)">
         {entry.year}
        </span>
        <h4 className="mt-1 text-lg font-bold text-(--color-text)">
         {entry.title}
        </h4>
        <p className="mt-2 text-sm text-(--color-text-muted)">
         {entry.description}
        </p>
       </div>
      ))}
     </div>
    </div>
   </AnimatedSection>

   {/* ───── CTA ───── */}
   <AnimatedSection tone="brand" amount={0.15}>
    <div className="mx-auto max-w-3xl text-center">
     <h2 className="animate fade-up text-4xl font-bold tracking-tight md:text-5xl" data-stagger="0">
      Want to work together?
     </h2>
     <p className="animate fade-up mt-4 text-lg text-(--color-text-muted)" data-stagger="1">
      I&apos;m always open to interesting projects and collaborations.
     </p>
     <div className="animate fade-up mt-8 flex items-center justify-center gap-3" data-stagger="2">
      <ButtonLink href="/contact">
       Get in Touch
      </ButtonLink>
      <ButtonLink
       href={SOCIAL_LINKS.github}
       variant="ghost"
       className="border-(--color-border) text-(--color-text) hover:bg-(--color-surface)"
      >
       GitHub ↗
      </ButtonLink>
     </div>
    </div>
   </AnimatedSection>
  </>
 );
}
