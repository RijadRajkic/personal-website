/* ============================================================================
 * Content types — shared interfaces for projects, blog posts, and page data.
 *
 * These are the "pure" types that components consume. They intentionally
 * have no dependency on Notion SDK types so hardcoded data and Notion-fetched
 * data use the exact same shape.
 * ========================================================================= */

export type ProjectCategory = "Full-Stack Platform" | "Enterprise System" | "Open Source" | "Tool";

export interface Project {
 id: string;
 slug: string;
 title: string;
 description: string;
 category: ProjectCategory;
 techStack: string[];
 status: "Published" | "Draft";
 featured: boolean;
 sortOrder: number;
 coverImage?: string;
 liveUrl?: string;
 sourceUrl?: string;
 year: string;
 /** Long-form body content — plain paragraphs for hardcoded data. */
 body?: string[];
}

export interface BlogPost {
 id: string;
 slug: string;
 title: string;
 excerpt: string;
 publishedAt: string;
 updatedAt?: string;
 category: string;
 tags: string[];
 readTime: string;
 coverImage?: string;
 featured: boolean;
 status: "Published" | "Draft";
 /** Long-form body content — plain paragraphs for hardcoded data. */
 body?: string[];
}

export interface BlogHeading {
 id: string;
 text: string;
 level: 2 | 3;
}

export interface TimelineEntry {
 year: string;
 title: string;
 description: string;
}

export interface TechCategory {
 label: string;
 items: string[];
}
