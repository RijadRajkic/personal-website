import "server-only";
import { Client } from "@notionhq/client";

let _client: Client | null = null;

export function getNotionClient(): Client | null {
 const token = process.env.NOTION_TOKEN;
 if (!token) return null;
 _client ??= new Client({ auth: token });
 return _client;
}

const MAX_INFLIGHT = 3;
const inflight = new Set<Promise<unknown>>();

export async function withSemaphore<T>(fn: () => Promise<T>): Promise<T> {
 while (inflight.size >= MAX_INFLIGHT) {
  await Promise.race(inflight).catch(() => {});
 }
 const p = fn();
 inflight.add(p);
 try {
  return await p;
 } finally {
  inflight.delete(p);
 }
}

export async function fetchPageBlocks(
 client: Client,
 pageId: string,
): Promise<string[]> {
 const paragraphs: string[] = [];
 let cursor: string | undefined = undefined;
 do {
  const res: Awaited<ReturnType<typeof client.blocks.children.list>> = await withSemaphore(() =>
   client.blocks.children.list({ block_id: pageId, start_cursor: cursor, page_size: 100 }),
  );
  for (const block of res.results) {
   if (!("type" in block)) continue;
   const text = extractBlockText(block);
   if (text) paragraphs.push(text);
  }
  cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
 } while (cursor);
 return paragraphs;
}

type RichTextLike = { plain_text?: string };

function richToString(rich: RichTextLike[] | undefined): string {
 if (!rich) return "";
 return rich.map((r) => r.plain_text ?? "").join("");
}

function extractBlockText(block: unknown): string {
 if (typeof block !== "object" || block === null) return "";
 const b = block as { type?: string } & Record<string, unknown>;
 const type = b.type;
 if (!type) return "";
 const payload = b[type] as { rich_text?: RichTextLike[] } | undefined;
 const rich = payload?.rich_text;
 if (type === "paragraph") return richToString(rich);
 if (type === "heading_1") return richToString(rich);
 if (type === "heading_2") return richToString(rich);
 if (type === "heading_3") return richToString(rich);
 if (type === "bulleted_list_item") return `• ${richToString(rich)}`;
 if (type === "numbered_list_item") return richToString(rich);
 if (type === "quote") return richToString(rich);
 if (type === "code") return richToString(rich);
 return "";
}
