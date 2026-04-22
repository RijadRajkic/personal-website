import type { Project } from "@/types/content";

export const projects: Project[] = [
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
  body: [
   "ShelfSync started as a personal frustration — I had books scattered across Goodreads, spreadsheets, and physical shelves with no unified system. I built it as a monorepo with three packages: a React Native mobile app, an Express REST API, and a static marketing site.",
   "The API uses Prisma with PostgreSQL, featuring full-text search across titles, authors, and notes. Authentication is handled through JWT refresh tokens with secure cookie storage. The mobile app supports barcode scanning for instant book lookup via the Open Library API.",
   "One of the more interesting technical challenges was building an offline-first sync system. The app queues mutations when offline and replays them in order once connectivity returns, with conflict resolution based on last-write-wins timestamps.",
  ],
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
  body: [
   "This project was built for a client who needed a professional web presence to complement their LinkedIn consulting business. The key requirements were fast iteration on content, zero-downtime deployments, and a polished, animated UI.",
   "I chose Notion as the CMS backend — the client already managed their content calendar there, so it eliminated friction. The Next.js App Router fetches data via the Notion SDK at build time and ISR-revalidates every 60 seconds. Blog posts are rendered from Notion blocks with a custom block renderer.",
   "The animation system is a custom CSS-only framework using IntersectionObserver to toggle classes. No JavaScript animation libraries — just CSS transitions with GPU-accelerated transforms. This keeps the bundle small and respects prefers-reduced-motion.",
   "The contact form validates client-side with react-hook-form and submits to a Notion database via an API route, creating a lightweight CRM pipeline the client manages directly in Notion.",
  ],
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
  body: [
   "As a developer juggling multiple client projects, I found myself drowning in browser tabs. This extension lets you group tabs by client or project with a single click, then switch between workspaces instantly.",
   "The extension uses the WebExtensions API for cross-browser compatibility. Chrome gets native tab groups via the chrome.tabGroups API, while Firefox falls back to a custom popup-based group manager. Both share the same core logic through a browser abstraction layer.",
   "Session state persists to browser storage, so your tab groups survive restarts. The popup UI is vanilla HTML/CSS/JS — no frameworks, keeping the extension under 50KB.",
  ],
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
  body: [
   "Sila is a component library I built for an enterprise fintech platform. The design system includes primitives like Button, Input, Label, and CreditCard, compositional layout components like Flex and Box, and domain-specific components like PriceBox and Dropdown.",
   "Theming is handled through a centralized constants module with color tokens and a custom theme object. Components use styled-components for scoped styling with full TypeScript prop interfaces.",
   "The library was designed for a quotation workflow — users configure service packages, see real-time pricing, and submit requests. The form state management uses React Context with a SelectedDataContext provider.",
  ],
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
  body: [
   "I rebuilt my portfolio from the ground up, migrating from Next.js 14 Pages Router to a modern App Router architecture with Tailwind CSS v4's new CSS-only configuration.",
   "The design system uses five custom color scales — evergreen, copper, dusty-lavender, almond-cream, and molten-lava — defined via Tailwind v4's @theme directive. Semantic design tokens in CSS custom properties enable tone-switching for dark sections.",
   "The animation system was extracted from the Business by Bega project into a reusable CSS framework. It uses IntersectionObserver to trigger GPU-accelerated CSS transitions with configurable stagger, duration, and easing.",
  ],
 },
];

export function getPublishedProjects(): Project[] {
 return projects.filter((p) => p.status === "Published").sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProjects(limit = 3): Project[] {
 return getPublishedProjects()
  .filter((p) => p.featured)
  .slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
 return projects.find((p) => p.slug === slug && p.status === "Published");
}
