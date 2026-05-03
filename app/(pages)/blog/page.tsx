import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { getPublishedBlogPosts } from "@/lib/data/blog-posts";

export const metadata: Metadata = {
 title: "Blog",
 description:
  "Writing about frontend architecture, developer tooling, and the craft of building software.",
};

export default function BlogPage() {
 const posts = getPublishedBlogPosts();

 return (
  <>
   {/* ───── Header ───── */}
   <AnimatedSection padded={false} className="pb-0 pt-24 md:pt-32">
    <SectionHeading
     eyebrow="Blog"
     title="Writing"
     description="Notes on frontend architecture, developer tooling, and the craft of building software."
    />
   </AnimatedSection>

   {/* ───── Post grid ───── */}
   <AnimatedSection amount={0.1}>
    <div className="grid gap-6 md:grid-cols-2">
     {posts.map((post, index) => (
      <AnimatedCard key={post.slug} stagger={index}>
       <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge>{post.category}</Badge>
        <span className="text-xs uppercase tracking-[0.08em] text-(--color-text-muted)">
         {post.readTime}
        </span>
       </div>

       <h3 className="text-2xl font-bold tracking-tight text-(--color-text)">
        <Link
         href={`/blog/${post.slug}`}
         className="transition hover:text-(--color-brand)"
        >
         {post.title}
        </Link>
       </h3>

       <p className="mt-3 text-sm text-(--color-text-muted)">
        {post.excerpt}
       </p>

       <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
         <span
          key={tag}
          className="rounded-full bg-(--color-bg) px-2.5 py-0.5 text-xs font-medium text-(--color-text-muted)"
         >
          {tag}
         </span>
        ))}
       </div>

       <Link
        href={`/blog/${post.slug}`}
        className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.08em] text-(--color-brand) transition hover:opacity-80"
       >
        Read article
       </Link>
      </AnimatedCard>
     ))}
    </div>
   </AnimatedSection>
  </>
 );
}
