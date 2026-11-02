import type { MetadataRoute } from "next";

import { getEntries } from "@/lib/content";
import { siteUrl } from "@/site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split("T")[0];

  const pages = ["", "/blog"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: today,
  }));

  const posts = getEntries("blog").map((entry) => ({
    url: `${siteUrl}/blog/${entry.slug}`,
    lastModified: entry.metadata.publishedAt,
  }));

  return [...pages, ...posts];
}
