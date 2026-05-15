import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { getPublishedBlogPosts } from "@/lib/data/blog-posts";
import type { BlogPost } from "@/types/content";

export const metadata: Metadata = {
 title: "Blog",
 description:
  "Notes on frontend architecture, developer tooling, and the craft of building software.",
};

function formatDate(iso: string, short = false): string {
 const d = new Date(iso);
 return d.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  ...(short ? {} : { year: "numeric" }),
 });
}

function BlogRow({ post }: { post: BlogPost }) {
 return (
  <Link
   href={`/blog/${post.slug}`}
   className="group grid grid-cols-[auto_1fr] items-baseline gap-4 border-b border-(--color-border) py-6 transition-colors duration-300 hover:border-(--accent)/50 md:grid-cols-[110px_1fr_auto] md:gap-8 md:py-8"
  >
   <time
    dateTime={post.publishedAt}
    className="font-mono text-xs text-(--color-text-muted) md:text-sm"
   >
    <span className="md:hidden">{formatDate(post.publishedAt, true)}</span>
    <span className="hidden md:inline">{formatDate(post.publishedAt)}</span>
   </time>

   <div className="min-w-0">
    <h2 className="text-xl font-bold tracking-tight text-(--color-text) transition-colors duration-300 group-hover:text-(--accent) md:text-2xl">
     {post.title}
    </h2>
    <p className="mt-2 text-sm leading-relaxed text-(--color-text-muted) md:text-base">
     {post.excerpt}
    </p>
   </div>

   <span className="col-span-2 hidden font-mono text-xs text-(--color-text-muted) md:col-span-1 md:inline">
    {post.readTime}
   </span>
  </Link>
 );
}

export default function BlogPage() {
 const posts = getPublishedBlogPosts();
 return (
  <article className="mx-auto max-w-[900px] px-6 pt-14 pb-24 md:px-16 md:pt-20 md:pb-28">
   <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--accent)">
    <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" aria-hidden />
    Writing
   </div>

   <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-(--color-text) md:text-5xl lg:text-6xl">
    Notes on frontend, tools, and craft.
   </h1>

   <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-(--color-text-muted) md:text-xl">
    Long-form thinking. Mostly things I had to learn the hard way.
   </p>

   <div className="mt-10 md:mt-14">
    {posts.map((post) => (
     <BlogRow key={post.slug} post={post} />
    ))}
   </div>
  </article>
 );
}
