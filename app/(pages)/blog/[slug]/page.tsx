import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import { getPublishedBlogPosts, getBlogPostBySlug } from "@/lib/data/blog-posts";

interface PageProps {
 params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
 return getPublishedBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 const { slug } = await params;
 const post = getBlogPostBySlug(slug);
 if (!post) return {};
 return {
  title: post.title,
  description: post.excerpt,
 };
}

export default async function BlogPostPage({ params }: PageProps) {
 const { slug } = await params;
 const post = getBlogPostBySlug(slug);
 if (!post) notFound();

 return (
  <>
   {/* ───── Header ───── */}
   <AnimatedSection padded={false} className="pb-0 pt-24 md:pt-32">
    <div className="mx-auto max-w-3xl">
     <Link
      href="/blog"
      className="animate fade-up mb-8 inline-flex text-sm font-medium text-(--color-text-muted) transition hover:text-(--color-brand)"
      data-stagger="0"
     >
      ← All posts
     </Link>

     <div className="animate fade-up mb-4 flex flex-wrap items-center gap-3" data-stagger="1">
      <Badge>{post.category}</Badge>
      <span className="text-xs uppercase tracking-[0.08em] text-(--color-text-muted)">
       {post.readTime}
      </span>
      <time
       dateTime={post.publishedAt}
       className="text-xs text-(--color-text-muted)"
      >
       {new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
       })}
      </time>
     </div>

     <h1
      className="animate fade-up text-4xl font-bold tracking-tight text-(--color-text) md:text-5xl lg:text-6xl"
      data-stagger="2"
     >
      {post.title}
     </h1>

     <p
      className="animate fade-up mt-6 text-lg text-(--color-text-muted) md:text-xl"
      data-stagger="3"
     >
      {post.excerpt}
     </p>

     {post.tags.length > 0 && (
      <div className="animate fade-up mt-4 flex flex-wrap gap-1.5" data-stagger="4">
       {post.tags.map((tag) => (
        <span
         key={tag}
         className="rounded-full bg-(--color-surface) px-3 py-1 text-xs font-medium text-(--color-text-muted)"
        >
         {tag}
        </span>
       ))}
      </div>
     )}
    </div>
   </AnimatedSection>

   {/* ───── Body ───── */}
   {post.body && post.body.length > 0 && (
    <AnimatedSection amount={0.1}>
     <article className="prose-wrapper mx-auto max-w-3xl space-y-6">
      {post.body.map((paragraph, i) => (
       <p
        key={i}
        className="animate fade-up text-base leading-relaxed text-(--color-text-muted) md:text-lg"
        data-stagger={i}
       >
        {paragraph}
       </p>
      ))}
     </article>
    </AnimatedSection>
   )}
  </>
 );
}
