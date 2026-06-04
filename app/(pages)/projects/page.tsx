import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getPublishedProjects } from "@/lib/data/projects";
import type { Project } from "@/types/content";

export const metadata: Metadata = {
 title: "Projects",
 description: "Full-stack platforms, developer tools, and open-source work by Rijad Rajkic.",
};

function getInitials(title: string): string {
 return title
  .split(" ")
  .map((w) => w[0])
  .slice(0, 2)
  .join("")
  .toUpperCase();
}

function ProjectCard({ project }: { project: Project }) {
 const overflow = Math.max(0, project.techStack.length - 4);
 const stack = project.techStack.slice(0, 4);

 return (
  <Link
   href={`/projects/${project.slug}`}
   className="group relative flex flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)/60 transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-(--accent)/40 focus-visible:-translate-y-1 focus-visible:border-(--accent)/40 focus-visible:outline-none"
  >
   <div className="relative grid h-[120px] place-items-center overflow-hidden border-b border-(--color-border)/60 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_70%)]">
    <span className="font-mono text-3xl font-bold tracking-tight text-(--accent)/70 md:text-4xl">
     {getInitials(project.title)}
    </span>
   </div>

   <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
    <div className="flex items-baseline justify-between gap-3">
     <h2 className="text-lg font-bold tracking-tight text-(--color-text) md:text-xl">
      {project.title}
     </h2>
     <span className="font-mono text-xs text-(--color-text-muted)">{project.year}</span>
    </div>

    <p className="text-sm leading-relaxed text-(--color-text-muted)">{project.description}</p>

    <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
     {stack.map((tech) => (
      <li
       key={tech}
       className="rounded-full border border-(--color-border) px-2 py-0.5 text-[11px] text-(--color-text-muted)"
      >
       {tech}
      </li>
     ))}
     {overflow > 0 && (
      <li className="rounded-full border border-(--color-border) px-2 py-0.5 text-[11px] text-(--color-text-muted)">
       +{overflow}
      </li>
     )}
    </ul>
   </div>
  </Link>
 );
}

export default async function ProjectsPage() {
 const projects = await getPublishedProjects();
 return (
  <article className="mx-auto max-w-[1100px] px-6 pt-14 pb-24 md:px-16 md:pt-20 md:pb-28">
   <div className="page-eyebrow mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--accent)">
    <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" aria-hidden />
    Projects
   </div>

   <h1 className="page-title text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-(--color-text) md:text-5xl lg:text-6xl">
    Things I&apos;ve built.
   </h1>

   <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-(--color-text-muted) md:text-xl">
    A selection of full-stack products, developer tools, and client work — each one shipped and maintained.
   </p>

   <div className="mt-12 grid gap-4 md:mt-16 md:gap-5 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
    {projects.map((p) => (
     <ProjectCard key={p.slug} project={p} />
    ))}
   </div>
  </article>
 );
}
