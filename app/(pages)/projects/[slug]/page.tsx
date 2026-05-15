import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { getPublishedProjects, getProjectBySlug } from "@/lib/data/projects";
import type { Project } from "@/types/content";

interface PageProps {
 params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
 return getPublishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 const { slug } = await params;
 const project = getProjectBySlug(slug);
 if (!project) return {};
 return { title: project.title, description: project.description };
}

function getInitials(title: string): string {
 return title.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function getNextProject(current: Project): Project {
 const all = getPublishedProjects();
 const idx = all.findIndex((p) => p.slug === current.slug);
 return all[(idx + 1) % all.length];
}

export default async function ProjectDetailPage({ params }: PageProps) {
 const { slug } = await params;
 const project = getProjectBySlug(slug);
 if (!project) notFound();
 const next = getNextProject(project);

 return (
  <article className="mx-auto max-w-[880px] px-6 pt-14 pb-24 md:px-16 md:pt-16 md:pb-28">
   <Link
    href="/projects"
    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--accent) transition hover:opacity-80"
   >
    <span aria-hidden>←</span> All projects
   </Link>

   <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-(--color-text) md:text-5xl lg:text-6xl">
    {project.title}
   </h1>

   <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-(--color-text-muted)">
    <span className="font-mono text-(--accent)">{project.year}</span>
    <span className="opacity-40">·</span>
    <span>{project.category}</span>
    {project.liveUrl && (
     <>
      <span className="opacity-40">·</span>
      <a
       href={project.liveUrl}
       target="_blank"
       rel="noopener noreferrer"
       className="border-b border-(--color-border-strong) text-(--color-text) transition hover:border-(--accent) hover:text-(--accent)"
      >
       Visit site ↗
      </a>
     </>
    )}
    {project.sourceUrl && (
     <>
      <span className="opacity-40">·</span>
      <a
       href={project.sourceUrl}
       target="_blank"
       rel="noopener noreferrer"
       className="border-b border-(--color-border-strong) text-(--color-text) transition hover:border-(--accent) hover:text-(--accent)"
      >
       Source ↗
      </a>
     </>
    )}
   </div>

   <div className="relative mt-8 grid aspect-[16/9] place-items-center overflow-hidden rounded-2xl border border-(--color-border) bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_30%,transparent),rgba(0,0,0,0.4))]">
    <div
     aria-hidden
     className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(240,236,230,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(240,236,230,0.06)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_35%_50%,black,transparent_80%)]"
    />
    <div className="font-mono text-6xl font-bold tracking-[-0.04em] text-(--accent)/50 md:text-8xl">
     {getInitials(project.title)}
    </div>
   </div>

   {project.body && project.body.length > 0 && (
    <div className="prose-wrapper mt-10 space-y-5 text-base leading-relaxed text-(--color-text-muted) md:text-lg">
     {project.body.map((paragraph, i) => (
      <p key={i}>{paragraph}</p>
     ))}
    </div>
   )}

   <Link
    href={`/projects/${next.slug}`}
    className="group mt-16 flex items-center justify-between gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface)/40 px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-(--accent)/40 md:px-7 md:py-6"
   >
    <div>
     <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-(--accent)">
      Next project
     </div>
     <div className="mt-1 text-xl font-bold tracking-tight text-(--color-text) md:text-2xl">
      {next.title}
     </div>
    </div>
    <span aria-hidden className="text-2xl text-(--accent) transition-transform duration-300 group-hover:translate-x-1">
     →
    </span>
   </Link>
  </article>
 );
}
