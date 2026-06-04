import "server-only";
import { fetchPageBlocks, getNotionClient, withSemaphore } from "./shared";
import type { Project, ProjectCategory } from "@/types/content";

type RichTextLike = { plain_text?: string };
type NotionProperty =
 | { type: "title"; title: RichTextLike[] }
 | { type: "rich_text"; rich_text: RichTextLike[] }
 | { type: "select"; select: { name: string } | null }
 | { type: "multi_select"; multi_select: { name: string }[] }
 | { type: "checkbox"; checkbox: boolean }
 | { type: "number"; number: number | null }
 | { type: "url"; url: string | null }
 | { type: "files"; files: { file?: { url: string }; external?: { url: string } }[] };

const CATEGORY_VALUES: ProjectCategory[] = [
 "Full-Stack Platform",
 "Enterprise System",
 "Open Source",
 "Tool",
];

function richTextProp(p: NotionProperty | undefined): string {
 if (!p) return "";
 if (p.type === "title") return p.title.map((r) => r.plain_text ?? "").join("");
 if (p.type === "rich_text") return p.rich_text.map((r) => r.plain_text ?? "").join("");
 return "";
}

function selectProp(p: NotionProperty | undefined): string {
 if (!p || p.type !== "select" || !p.select) return "";
 return p.select.name;
}

function multiSelectProp(p: NotionProperty | undefined): string[] {
 if (!p || p.type !== "multi_select") return [];
 return p.multi_select.map((o) => o.name);
}

function checkboxProp(p: NotionProperty | undefined): boolean {
 if (!p || p.type !== "checkbox") return false;
 return p.checkbox;
}

function numberProp(p: NotionProperty | undefined): number {
 if (!p || p.type !== "number" || p.number === null) return 0;
 return p.number;
}

function urlProp(p: NotionProperty | undefined): string | undefined {
 if (!p || p.type !== "url" || !p.url) return undefined;
 return p.url;
}

function fileProp(p: NotionProperty | undefined): string | undefined {
 if (!p || p.type !== "files" || p.files.length === 0) return undefined;
 const f = p.files[0];
 return f.file?.url ?? f.external?.url;
}

async function mapPageToProject(
 pageId: string,
 properties: Record<string, NotionProperty>,
 includeBody: boolean,
): Promise<Project | null> {
 const title = richTextProp(properties.Title) || richTextProp(properties.Name);
 const slug = richTextProp(properties.Slug);
 if (!title || !slug) return null;

 const rawCategory = selectProp(properties.Category);
 const category = (CATEGORY_VALUES as string[]).includes(rawCategory)
  ? (rawCategory as ProjectCategory)
  : "Tool";
 const rawStatus = selectProp(properties.Status);
 const status: Project["status"] = rawStatus === "Published" ? "Published" : "Draft";

 const project: Project = {
  id: pageId,
  slug,
  title,
  description: richTextProp(properties.Description),
  category,
  techStack: multiSelectProp(properties["Tech Stack"]),
  status,
  featured: checkboxProp(properties.Featured),
  sortOrder: numberProp(properties["Sort Order"]),
  coverImage: fileProp(properties["Cover Image"]),
  liveUrl: urlProp(properties["Live URL"]),
  sourceUrl: urlProp(properties["Source URL"]),
  year: richTextProp(properties.Year) || selectProp(properties.Year),
 };

 if (includeBody) {
  const client = getNotionClient();
  if (client) {
   try {
    project.body = await fetchPageBlocks(client, pageId);
   } catch {
    // Block fetch is best-effort; the metadata is still useful without body.
   }
  }
 }

 return project;
}

export async function fetchProjectsFromNotion(): Promise<Project[] | null> {
 const client = getNotionClient();
 const dataSourceId = process.env.NOTION_DB_PROJECTS;
 if (!client || !dataSourceId) return null;

 try {
  const res = await withSemaphore(() =>
   client.dataSources.query({
    data_source_id: dataSourceId,
    sorts: [{ property: "Sort Order", direction: "ascending" }],
   }),
  );
  const projects: Project[] = [];
  for (const item of res.results) {
   if (item.object !== "page" || !("properties" in item)) continue;
   const p = await mapPageToProject(
    item.id,
    item.properties as Record<string, NotionProperty>,
    false,
   );
   if (p) projects.push(p);
  }
  return projects;
 } catch {
  return null;
 }
}

export async function fetchProjectBySlugFromNotion(slug: string): Promise<Project | null> {
 const client = getNotionClient();
 const dataSourceId = process.env.NOTION_DB_PROJECTS;
 if (!client || !dataSourceId) return null;

 try {
  const res = await withSemaphore(() =>
   client.dataSources.query({
    data_source_id: dataSourceId,
    filter: { property: "Slug", rich_text: { equals: slug } },
    page_size: 1,
   }),
  );
  const item = res.results[0];
  if (!item || item.object !== "page" || !("properties" in item)) return null;
  return mapPageToProject(item.id, item.properties as Record<string, NotionProperty>, true);
 } catch {
  return null;
 }
}
