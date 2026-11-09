import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/blog";
import { siteUrl } from "@/site.config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getPosts()).filter((post) => !post.draft);
  const lastChanged = (post: (typeof posts)[number]) => post.updatedAt ?? post.publishedAt;

  return [
    { url: siteUrl },
    {
      url: `${siteUrl}/blog`,
      lastModified: posts.map(lastChanged).sort().at(-1),
    },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: lastChanged(post),
    })),
  ];
}
