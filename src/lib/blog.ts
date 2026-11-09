import type { Document, Node } from "@contentful/rich-text-types";
import { cache } from "react";

import {
  fetchEntries,
  fetchPublishedIds,
  previewEnabled,
  type RawAsset,
  type RawEntry,
} from "@/lib/contentful";

// Blog posts come from Contentful (content type `blogPost`, set up by
// `npm run contentful:setup`).

export type Media = {
  url: string;
  contentType: string;
  width?: number;
  height?: number;
  title: string;
  // Used as the image's alt text and caption.
  description: string;
};

// What a link inside a post's body points to, resolved at fetch time.
export type Embed =
  | ({ kind: "media" } & Media)
  | { kind: "code"; code: string; language: string; filename?: string }
  | { kind: "post"; slug: string; title: string };

export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  seoTitle?: string;
  seoDescription?: string;
  // YYYY-MM-DD
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  cover?: Media;
  body: Document;
  wordCount: number;
  readingTime: number;
  // Only ever true in `npm run dev` with a preview token.
  draft: boolean;
};

const emptyDocument: Document = { nodeType: "document" as Document["nodeType"], data: {}, content: [] };

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const day = (value: unknown) => text(value).slice(0, 10) || undefined;

function toMedia(asset: RawAsset | undefined): Media | undefined {
  const file = asset?.fields.file;
  if (!asset || !file?.url) return undefined;
  return {
    url: file.url.startsWith("//") ? `https:${file.url}` : file.url,
    contentType: file.contentType,
    width: file.details?.image?.width,
    height: file.details?.image?.height,
    title: text(asset.fields.title),
    description: text(asset.fields.description),
  };
}

function toEmbed(entry: RawEntry | undefined): Embed | null {
  if (!entry) return null;
  const f = entry.fields;
  switch (entry.sys.contentType.sys.id) {
    case "codeBlock":
      return {
        kind: "code",
        code: typeof f.code === "string" ? f.code.replace(/\s+$/, "") : "",
        language: text(f.language) || "plaintext",
        filename: text(f.filename) || undefined,
      };
    case "blogPost":
      return text(f.slug) ? { kind: "post", slug: text(f.slug), title: text(f.title) } : null;
    default:
      return null;
  }
}

// Swaps every link in the rich text for the thing it points to (or null
// when it can't be shown, e.g. an unpublished code block).
function resolveLinks(node: Node, entries: Map<string, RawEntry>, assets: Map<string, RawAsset>) {
  const target = node.data?.target;
  if (target?.sys?.type === "Link") {
    if (target.sys.linkType === "Asset") {
      const media = toMedia(assets.get(target.sys.id));
      node.data.target = media ? { kind: "media", ...media } : null;
    } else {
      node.data.target = toEmbed(entries.get(target.sys.id));
    }
  }
  if ("content" in node && Array.isArray(node.content)) {
    for (const child of node.content as Node[]) resolveLinks(child, entries, assets);
  }
}

const isInline = (node: Node) =>
  node.nodeType === "text" || node.nodeType.includes("hyperlink") || node.nodeType.includes("inline");

// The text of a node: runs of text joined as they are, blocks on new lines.
export function plainText(node: Node): string {
  if (node.nodeType === "text") return (node as Node & { value: string }).value;
  if ("content" in node && Array.isArray(node.content)) {
    const children = node.content as Node[];
    return children.map(plainText).join(children.every(isInline) ? "" : "\n");
  }
  return "";
}

function toPost(
  entry: RawEntry,
  entries: Map<string, RawEntry>,
  assets: Map<string, RawAsset>,
  draft: boolean,
): Post | undefined {
  const f = entry.fields;
  const slug = text(f.slug);
  const title = text(f.title);
  // Drafts in preview can be half written; skip them until they have these.
  if (!slug || !title) return undefined;

  const body = (f.body as Document | undefined) ?? structuredClone(emptyDocument);
  resolveLinks(body, entries, assets);
  const coverLink = f.cover as { sys?: { id?: string } } | undefined;
  const wordCount = plainText(body).split(/\s+/).filter(Boolean).length;

  return {
    id: entry.sys.id,
    slug,
    title,
    summary: text(f.summary),
    seoTitle: text(f.seoTitle) || undefined,
    seoDescription: text(f.seoDescription) || undefined,
    // No date set: the day it was first published (or created, for drafts).
    publishedAt: day(f.publishedAt) ?? entry.sys.createdAt.slice(0, 10),
    updatedAt: day(f.updatedAt),
    tags: Array.isArray(f.tags) ? f.tags.map(text).filter(Boolean) : [],
    cover: coverLink?.sys?.id ? toMedia(assets.get(coverLink.sys.id)) : undefined,
    body,
    wordCount,
    // About 230 words a minute, never less than one.
    readingTime: Math.max(1, Math.round(wordCount / 230)),
    draft,
  };
}

async function loadPosts(): Promise<Post[]> {
  const api = previewEnabled ? "preview" : "delivery";
  const [{ items, entries, assets }, publishedIds] = await Promise.all([
    fetchEntries("blogPost", api),
    previewEnabled ? fetchPublishedIds("blogPost") : Promise.resolve(undefined),
  ]);

  const posts = items
    .map((entry) =>
      toPost(entry, entries, assets, publishedIds ? !publishedIds.has(entry.sys.id) : false),
    )
    .filter((post): post is Post => post !== undefined)
    // Newest first.
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));

  // A slug can only be used once; Contentful enforces it on publish, but
  // drafts in preview can still clash.
  const seen = new Set<string>();
  return posts.filter((post) => !seen.has(post.slug) && seen.add(post.slug));
}

// Fetched once per build (every page reuses it) and once per request in dev,
// so edits in Contentful show up on reload.
let built: Promise<Post[]> | undefined;

export const getPosts = cache((): Promise<Post[]> => {
  if (process.env.NODE_ENV === "production") return (built ??= loadPosts());
  return loadPosts();
});

export async function getPost(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug);
}

// The pages to build under /blog/[slug]. A static export needs at least one,
// so with no posts a placeholder is built: it shows the 404 page, isn't
// linked or in the sitemap, and keeps the build working.
export async function getPostParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "no-posts" }];
}

export function formatDate(date: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Date(`${date}T00:00:00Z`).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  });
}
