import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { getPublishedProjects } from "@/lib/data/projects";
import type { ProjectCategory } from "@/types/content";

export const metadata: Metadata = {
 title: "Projects",
 description:
  "Full-stack platforms, developer tools, and open source work by Rijad Rajkic.",
};

const categoryOrder: ProjectCategory[] = [
 "Full-Stack Platform",
 "Tool",
 "Enterprise System",
 "Open Source",
];

export default function ProjectsPage() {
 const projects = getPublishedProjects();

 const grouped = categoryOrder
  .map((cat) => ({
   category: cat,
   items: projects.filter((p) => p.category === cat),
  }))
  .filter((g) => g.items.length > 0);

 return (
  <>
   {/* ───── Header ───── */}
   <AnimatedSection padded={false} className="pb-0 pt-24 md:pt-32">
    <SectionHeading
     eyebrow="Projects"
     title="Things I've built"
     description="A selection of full-stack products, developer tools, and client work — each one shipped and maintained."
    />
   </AnimatedSection>

   {/* ───── Grouped project cards ───── */}
   {grouped.map((group) => (
    <AnimatedSection key={group.category} amount={0.1}>
     <h3 className="animate fade-up mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-(--color-text-muted)">
      {group.category}
     </h3>

     <div className="grid gap-6 md:grid-cols-2">
      {group.items.map((project, index) => (
       <AnimatedCard key={project.slug} stagger={index}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
         <Badge>{project.category}</Badge>
         <span className="text-xs text-(--color-text-muted)">
          {project.year}
         </span>
        </div>

        <h4 className="text-2xl font-bold tracking-tight text-(--color-text)">
         <Link
          href={`/projects/${project.slug}`}
          className="transition hover:text-(--color-brand)"
         >
          {project.title}
         </Link>
        </h4>

        <p className="mt-3 text-sm text-(--color-text-muted)">
         {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
         {project.techStack.map((tech) => (
          <span
           key={tech}
           className="rounded-full bg-(--color-bg) px-2.5 py-0.5 text-xs font-medium text-(--color-text-muted)"
          >
           {tech}
          </span>
         ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
         <Link
          href={`/projects/${project.slug}`}
          className="text-sm font-semibold uppercase tracking-[0.08em] text-(--color-brand) transition hover:opacity-80"
         >
          View project
         </Link>
         {project.sourceUrl && (
          <a
           href={project.sourceUrl}
           target="_blank"
           rel="noopener noreferrer"
           className="text-sm text-(--color-text-muted) transition hover:text-(--color-text)"
          >
           GitHub ↗
          </a>
         )}
        </div>
       </AnimatedCard>
      ))}
     </div>
    </AnimatedSection>
   ))}
  </>
 );
}
