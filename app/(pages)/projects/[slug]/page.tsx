import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getPublishedProjects, getProjectBySlug } from "@/lib/data/projects";

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
 return {
  title: project.title,
  description: project.description,
 };
}

export default async function ProjectDetailPage({ params }: PageProps) {
 const { slug } = await params;
 const project = getProjectBySlug(slug);
 if (!project) notFound();

 return (
  <>
   {/* ───── Hero ───── */}
   <AnimatedSection padded={false} className="pb-0 pt-24 md:pt-32">
    <div className="mx-auto max-w-3xl">
     <Link
      href="/projects"
      className="animate fade-up mb-8 inline-flex text-sm font-medium text-(--color-text-muted) transition hover:text-(--color-brand)"
      data-stagger="0"
     >
      ← All projects
     </Link>

     <div className="animate fade-up mb-4 flex flex-wrap items-center gap-2" data-stagger="1">
      <Badge>{project.category}</Badge>
      <span className="text-xs text-(--color-text-muted)">{project.year}</span>
     </div>

     <h1
      className="animate fade-up text-4xl font-bold tracking-tight text-(--color-text) md:text-5xl lg:text-6xl"
      data-stagger="2"
     >
      {project.title}
     </h1>

     <p
      className="animate fade-up mt-6 text-lg text-(--color-text-muted) md:text-xl"
      data-stagger="3"
     >
      {project.description}
     </p>

     <div
      className="animate fade-up mt-4 flex flex-wrap gap-1.5"
      data-stagger="4"
     >
      {project.techStack.map((tech) => (
       <span
        key={tech}
        className="rounded-full bg-(--color-surface) px-3 py-1 text-xs font-medium text-(--color-text-muted)"
       >
        {tech}
       </span>
      ))}
     </div>

     <div
      className="animate fade-up mt-8 flex items-center gap-3"
      data-stagger="5"
     >
      {project.liveUrl && (
       <ButtonLink href={project.liveUrl} size="md">
        Visit Live Site ↗
       </ButtonLink>
      )}
      {project.sourceUrl && (
       <ButtonLink href={project.sourceUrl} variant="ghost" size="md">
        View Source ↗
       </ButtonLink>
      )}
     </div>
    </div>
   </AnimatedSection>

   {/* ───── Body ───── */}
   {project.body && project.body.length > 0 && (
    <AnimatedSection amount={0.1}>
     <div className="prose-wrapper mx-auto max-w-3xl space-y-6">
      {project.body.map((paragraph, i) => (
       <p
        key={i}
        className="animate fade-up text-base leading-relaxed text-(--color-text-muted) md:text-lg"
        data-stagger={i}
       >
        {paragraph}
       </p>
      ))}
     </div>
    </AnimatedSection>
   )}
  </>
 );
}
