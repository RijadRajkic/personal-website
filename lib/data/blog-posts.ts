import type { BlogPost } from "@/types/content";

export const blogPosts: BlogPost[] = [
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
  body: [
   "Most animation libraries ship tens of kilobytes of JavaScript just to fade elements in on scroll. I wanted something lighter — a system that uses CSS transitions as the animation engine and JavaScript only as the trigger.",
   "The core idea is simple: elements start with opacity: 0 and a transform offset (translateY for fade-up, scale for scale-up). An IntersectionObserver watches for visibility and toggles an .in-view class. CSS transitions handle the rest.",
   "Custom properties make the system configurable without JavaScript. --animate-duration, --animate-delay, --animate-easing, and --animate-distance can all be overridden per-element via inline styles or utility classes.",
   "Stagger animations are the trickiest part. I use data-stagger attributes (0–11) that map to calculated delays: delay = stagger-index × stagger-gap. The CSS uses manual attribute selectors as a fallback since attr() with type() isn't widely supported yet.",
   "The entire system is under 5KB of CSS with zero JavaScript runtime cost beyond the observer setup. It respects prefers-reduced-motion automatically, and because it uses will-change: opacity, transform, animations are GPU-composited.",
   "I've extracted this into a reusable module that I now share across projects. The pattern works with any framework — React, Vue, or plain HTML — since it's just CSS classes and a small observer hook.",
  ],
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
  body: [
   "My old portfolio was a single-page React app built with Next.js 14 Pages Router. It worked, but it felt dated — no blog, no project detail pages, and the styling was a mix of Tailwind v3 utilities and inline styles with no cohesive design system.",
   "I decided to rebuild rather than migrate. A fresh create-next-app with the App Router gave me server components by default, route groups for layout composition, and generateMetadata for proper SEO on every page.",
   "Tailwind CSS v4 was the biggest shift. No more tailwind.config.ts — everything lives in CSS via the @theme directive. I defined five color scales (evergreen, copper, dusty-lavender, almond-cream, molten-lava) with 11 steps each, plus semantic tokens in :root that map palette colors to functional roles.",
   "The font setup uses next/font/local with Geist Sans and Mono, exposed as CSS variables that Tailwind v4 picks up via @theme inline. This means font-sans and font-mono utilities just work without any config file.",
   "The architecture borrows patterns from a client project — route groups, a shared animation system, semantic design tokens, and a component library built entirely by hand. No shadcn, no Radix, no component library dependencies. Just React, CSS, and intention.",
  ],
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
  body: [
   "Before server components, my data fetching pattern was predictable: useEffect on mount, loading state, error state, render. Or SWR/React Query for caching. Every page component was a client component by necessity.",
   "Server components flip this completely. Data fetching happens at the component level during rendering — no hooks, no loading spinners, no waterfall requests. You just await your data and render it. The component never ships to the client.",
   "The practical impact is huge. My Notion CMS integration is server-only — the SDK, the API key, the response parsing all stay on the server. The client bundle has zero knowledge of Notion. This is not just a performance win; it is a security boundary.",
   "The mental model shift is from 'fetch data then render' to 'render with data.' Components become more like templates that receive their dependencies through the rendering process itself. It feels closer to PHP or Rails than traditional React.",
   "Where I still use client components: interactive forms, navigation state, scroll-triggered animations. The boundary is clear — if it responds to user events, it is a client component. If it just displays data, it stays on the server.",
   "The combination of server components for data display and client components for interactivity gives you the best of both worlds. Your pages load fast because they are mostly static HTML, but they become interactive where it matters.",
  ],
 },
];

export function getPublishedBlogPosts(): BlogPost[] {
 return blogPosts
  .filter((p) => p.status === "Published")
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
 return getPublishedBlogPosts()
  .filter((p) => p.featured)
  .slice(0, limit);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
 return blogPosts.find((p) => p.slug === slug && p.status === "Published");
}
