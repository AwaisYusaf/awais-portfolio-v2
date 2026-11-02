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

  const entries = (["work", "blog"] as const).flatMap((collection) =>
    getEntries(collection).map((entry) => ({
      url: `${siteUrl}/${collection}/${entry.slug}`,
      lastModified: entry.metadata.publishedAt,
    })),
  );

  return [...pages, ...entries];
}
