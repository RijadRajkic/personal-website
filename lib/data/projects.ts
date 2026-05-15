import "server-only";
import { unstable_cache } from "next/cache";
import type { Project } from "@/types/content";
import {
 fetchProjectBySlugFromNotion,
 fetchProjectsFromNotion,
} from "@/lib/notion/projects";

/**
 * Hardcoded fallback used whenever NOTION_TOKEN / NOTION_DB_PROJECTS aren't
 * configured or the Notion fetch fails. Notion-backed data and this list share
 * the exact same `Project` shape, per the design hub.
 */
const projects: Project[] = [
 {
  id: "1",
  slug: "shelfsync",
  title: "ShelfSync",
  description:
   "Full-stack book tracking platform with a mobile app, REST API, and marketing website. Lets readers catalog their library, track reading progress, and discover new books.",
  category: "Full-Stack Platform",
  techStack: ["TypeScript", "React Native", "Node.js", "PostgreSQL", "Prisma", "Express"],
  status: "Published",
  featured: true,
  sortOrder: 1,
  liveUrl: "https://shelfsync.app",
  sourceUrl: "https://github.com/RijadRajkic/shelfsync",
  year: "2025",
 },
 {
  id: "2",
  slug: "business-by-bega",
  title: "Business by Bega",
  description:
   "Personal brand website for a LinkedIn authority strategist. Features a CMS powered by Notion, scroll-triggered animations, a blog with server-rendered MDX, and a contact pipeline.",
  category: "Full-Stack Platform",
  techStack: ["TypeScript", "Next.js", "Tailwind CSS", "Notion API", "Vercel", "React Hook Form"],
  status: "Published",
  featured: true,
  sortOrder: 2,
  liveUrl: "https://branded-by-begich.com",
  sourceUrl: "https://github.com/RijadRajkic/bussines-by-bega",
  year: "2025",
 },
 {
  id: "3",
  slug: "client-tab-manager",
  title: "Client Tab Manager",
  description:
   "Cross-browser extension for Chrome and Firefox that organizes tabs by client or project. Supports grouping, quick-switch, and session persistence across restarts.",
  category: "Tool",
  techStack: ["JavaScript", "WebExtensions API", "Chrome Extensions", "Firefox Add-ons"],
  status: "Published",
  featured: true,
  sortOrder: 3,
  sourceUrl: "https://github.com/RijadRajkic/client-tab-manager",
  year: "2024",
 },
 {
  id: "4",
  slug: "sila-frontend",
  title: "Sila Frontend",
  description:
   "Enterprise UI component library built for a fintech application. Includes theming, responsive layouts, and accessible form components with a custom design system.",
  category: "Enterprise System",
  techStack: ["TypeScript", "React", "Next.js", "Styled Components", "Storybook"],
  status: "Published",
  featured: false,
  sortOrder: 4,
  sourceUrl: "https://github.com/RijadRajkic/sila-frontend",
  year: "2024",
 },
 {
  id: "5",
  slug: "personal-website",
  title: "Personal Website",
  description:
   "This portfolio — rebuilt from scratch with Next.js App Router, Tailwind CSS v4, and a Notion CMS backend. Features scroll-driven animations and a custom design system.",
  category: "Open Source",
  techStack: ["TypeScript", "Next.js", "Tailwind CSS v4", "Notion API", "Vercel"],
  status: "Published",
  featured: false,
  sortOrder: 5,
  sourceUrl: "https://github.com/RijadRajkic/personal-website",
  year: "2026",
 },
];

function fallbackPublishedProjects(): Project[] {
 return projects
  .filter((p) => p.status === "Published")
  .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Try Notion first; fall back to the hardcoded list. Wrapped in
 * `unstable_cache` with a 10-minute revalidate so Notion edits show up
 * without redeploying but we don't hammer the API on every request.
 */
const loadAllProjects = unstable_cache(
 async (): Promise<Project[]> => {
  const fromNotion = await fetchProjectsFromNotion();
  if (fromNotion && fromNotion.length > 0) return fromNotion;
  return fallbackPublishedProjects();
 },
 ["projects-published"],
 { revalidate: 600, tags: ["projects"] },
);

export async function getPublishedProjects(): Promise<Project[]> {
 return loadAllProjects();
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
 const all = await loadAllProjects();
 return all.filter((p) => p.featured).slice(0, limit);
}

const loadProjectBySlug = unstable_cache(
 async (slug: string): Promise<Project | undefined> => {
  const fromNotion = await fetchProjectBySlugFromNotion(slug);
  if (fromNotion) return fromNotion;
  return projects.find((p) => p.slug === slug && p.status === "Published");
 },
 ["project-by-slug"],
 { revalidate: 600, tags: ["projects"] },
);

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
 return loadProjectBySlug(slug);
}
