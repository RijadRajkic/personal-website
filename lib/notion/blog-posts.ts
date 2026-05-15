import "server-only";
import { fetchPageBlocks, getNotionClient, withSemaphore } from "./shared";
import type { BlogPost } from "@/types/content";

type RichTextLike = { plain_text?: string };
type NotionProperty =
 | { type: "title"; title: RichTextLike[] }
 | { type: "rich_text"; rich_text: RichTextLike[] }
 | { type: "select"; select: { name: string } | null }
 | { type: "multi_select"; multi_select: { name: string }[] }
 | { type: "checkbox"; checkbox: boolean }
 | { type: "date"; date: { start: string; end?: string | null } | null }
 | { type: "files"; files: { file?: { url: string }; external?: { url: string } }[] };

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

function dateProp(p: NotionProperty | undefined): string {
 if (!p || p.type !== "date" || !p.date) return "";
 return p.date.start;
}

function fileProp(p: NotionProperty | undefined): string | undefined {
 if (!p || p.type !== "files" || p.files.length === 0) return undefined;
 const f = p.files[0];
 return f.file?.url ?? f.external?.url;
}

async function mapPageToBlogPost(
 pageId: string,
 properties: Record<string, NotionProperty>,
 includeBody: boolean,
): Promise<BlogPost | null> {
 const title = richTextProp(properties.Title) || richTextProp(properties.Name);
 const slug = richTextProp(properties.Slug);
 if (!title || !slug) return null;

 const rawStatus = selectProp(properties.Status);
 const status: BlogPost["status"] = rawStatus === "Published" ? "Published" : "Draft";

 const post: BlogPost = {
  id: pageId,
  slug,
  title,
  excerpt: richTextProp(properties.Excerpt),
  publishedAt: dateProp(properties["Published At"]),
  updatedAt: dateProp(properties["Updated At"]) || undefined,
  category: selectProp(properties.Category) || "Notes",
  tags: multiSelectProp(properties.Tags),
  readTime: richTextProp(properties["Read Time"]) || "5 min read",
  coverImage: fileProp(properties["Cover Image"]),
  featured: checkboxProp(properties.Featured),
  status,
 };

 if (includeBody) {
  const client = getNotionClient();
  if (client) {
   try {
    post.body = await fetchPageBlocks(client, pageId);
   } catch {
    // Best-effort body fetch; metadata is still useful without paragraphs.
   }
  }
 }

 return post;
}

export async function fetchBlogPostsFromNotion(): Promise<BlogPost[] | null> {
 const client = getNotionClient();
 const dataSourceId = process.env.NOTION_DB_BLOGPOSTS;
 if (!client || !dataSourceId) return null;

 try {
  const res = await withSemaphore(() =>
   client.dataSources.query({
    data_source_id: dataSourceId,
    sorts: [{ property: "Published At", direction: "descending" }],
   }),
  );
  const posts: BlogPost[] = [];
  for (const item of res.results) {
   if (item.object !== "page" || !("properties" in item)) continue;
   const p = await mapPageToBlogPost(
    item.id,
    item.properties as Record<string, NotionProperty>,
    false,
   );
   if (p) posts.push(p);
  }
  return posts;
 } catch {
  return null;
 }
}

export async function fetchBlogPostBySlugFromNotion(slug: string): Promise<BlogPost | null> {
 const client = getNotionClient();
 const dataSourceId = process.env.NOTION_DB_BLOGPOSTS;
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
  return mapPageToBlogPost(item.id, item.properties as Record<string, NotionProperty>, true);
 } catch {
  return null;
 }
}
