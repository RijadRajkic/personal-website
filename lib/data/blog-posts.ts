import "server-only";
import { unstable_cache } from "next/cache";
import type { BlogPost } from "@/types/content";
import {
 fetchBlogPostBySlugFromNotion,
 fetchBlogPostsFromNotion,
} from "@/lib/notion/blog-posts";

/**
 * Hardcoded fallback used whenever NOTION_TOKEN / NOTION_DB_BLOGPOSTS aren't
 * configured or the Notion fetch fails. Notion-backed data and this list share
 * the exact same `BlogPost` shape, per the design hub.
 */
const blogPosts: BlogPost[] = [
 {
  id: "1",
  slug: "building-a-modern-animation-system-with-pure-css",
  title: "Building a Modern Animation System with Pure CSS",
  excerpt:
   "How I built a zero-dependency, GPU-accelerated scroll animation framework using CSS custom properties and IntersectionObserver — no Framer Motion required.",
  publishedAt: "2026-04-10",
  category: "Frontend",
  tags: ["CSS", "Animations", "Performance", "IntersectionObserver"],
  readTime: "8 min read",
  featured: true,
  status: "Published",
 },
 {
  id: "2",
  slug: "why-i-rebuilt-my-portfolio-from-scratch",
  title: "Why I Rebuilt My Portfolio from Scratch",
  excerpt:
   "A behind-the-scenes look at migrating from Next.js Pages Router to App Router, adopting Tailwind CSS v4, and designing a five-scale color system.",
  publishedAt: "2026-04-15",
  category: "Career",
  tags: ["Next.js", "Portfolio", "Tailwind CSS v4", "App Router"],
  readTime: "6 min read",
  featured: true,
  status: "Published",
 },
 {
  id: "3",
  slug: "server-components-changed-how-i-think-about-data",
  title: "Server Components Changed How I Think About Data",
  excerpt:
   "React Server Components eliminated most of my client-side data fetching patterns. Here is what replaced them and why the mental model shift matters.",
  publishedAt: "2026-03-28",
  category: "Frontend",
  tags: ["React", "Server Components", "Next.js", "Data Fetching"],
  readTime: "7 min read",
  featured: false,
  status: "Published",
 },
];

function fallbackPublishedBlogPosts(): BlogPost[] {
 return blogPosts
  .filter((p) => p.status === "Published")
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

const loadAllBlogPosts = unstable_cache(
 async (): Promise<BlogPost[]> => {
  const fromNotion = await fetchBlogPostsFromNotion();
  if (fromNotion && fromNotion.length > 0) return fromNotion;
  return fallbackPublishedBlogPosts();
 },
 ["blog-posts-published"],
 { revalidate: 600, tags: ["blog-posts"] },
);

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
 return loadAllBlogPosts();
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
 const all = await loadAllBlogPosts();
 return all.filter((p) => p.featured).slice(0, limit);
}

const loadBlogPostBySlug = unstable_cache(
 async (slug: string): Promise<BlogPost | undefined> => {
  const fromNotion = await fetchBlogPostBySlugFromNotion(slug);
  if (fromNotion) return fromNotion;
  return blogPosts.find((p) => p.slug === slug && p.status === "Published");
 },
 ["blog-post-by-slug"],
 { revalidate: 600, tags: ["blog-posts"] },
);

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
 return loadBlogPostBySlug(slug);
}
