import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { getPublishedBlogPosts, getBlogPostBySlug } from "@/lib/data/blog-posts";
import type { BlogPost } from "@/types/content";

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
 return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string): string {
 return new Date(iso).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
 });
}

function getNextPost(current: BlogPost): BlogPost {
 const all = getPublishedBlogPosts();
 const idx = all.findIndex((p) => p.slug === current.slug);
 return all[(idx + 1) % all.length];
}

export default async function BlogPostPage({ params }: PageProps) {
 const { slug } = await params;
 const post = getBlogPostBySlug(slug);
 if (!post) notFound();
 const next = getNextPost(post);

 return (
  <article className="mx-auto max-w-[720px] px-6 pt-14 pb-24 md:px-8 md:pt-16 md:pb-28">
   <Link
    href="/blog"
    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--accent) transition hover:opacity-80"
   >
    <span aria-hidden>←</span> All writing
   </Link>

   <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-(--color-text-muted)">
    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
    <span className="opacity-40">·</span>
    <span>{post.readTime}</span>
    <span className="opacity-40">·</span>
    <span>{post.category}</span>
   </div>

   <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-(--color-text) md:text-5xl">
    {post.title}
   </h1>

   <p className="mt-6 text-lg leading-relaxed text-(--color-text-muted) md:text-xl">
    {post.excerpt}
   </p>

   {post.body && post.body.length > 0 && (
    <div className="prose-wrapper mt-10 space-y-5 text-base leading-relaxed text-(--color-text-muted) md:text-lg">
     {post.body.map((paragraph, i) => (
      <p key={i}>{paragraph}</p>
     ))}
    </div>
   )}

   {post.tags.length > 0 && (
    <div className="mt-12 flex flex-wrap gap-1.5">
     {post.tags.map((tag) => (
      <span
       key={tag}
       className="rounded-full border border-(--color-border) px-2.5 py-0.5 text-[11px] text-(--color-text-muted)"
      >
       {tag}
      </span>
     ))}
    </div>
   )}

   <Link
    href={`/blog/${next.slug}`}
    className="group mt-16 flex items-center justify-between gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface)/40 px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-(--accent)/40"
   >
    <div>
     <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-(--accent)">
      Next article
     </div>
     <div className="mt-1 text-lg font-bold tracking-tight text-(--color-text) md:text-xl">
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
