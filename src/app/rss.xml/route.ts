import { getPosts } from "@/lib/blog";
import { site, siteUrl } from "@/site.config";

export const dynamic = "force-static";

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const rssDate = (day: string) => new Date(`${day}T00:00:00Z`).toUTCString();

export async function GET() {
  const posts = (await getPosts()).filter((post) => !post.draft);

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const categories = post.tags
        .map((tag) => `\n      <category>${escape(tag)}</category>`)
        .join("");
      return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rssDate(post.publishedAt)}</pubDate>
      <dc:creator>${escape(site.person.name)}</dc:creator>
      <description>${escape(post.summary)}</description>${categories}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(site.seo.siteName)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escape(site.seo.description)}</description>
    <language>en</language>${posts[0] ? `\n    <lastBuildDate>${rssDate(posts[0].updatedAt ?? posts[0].publishedAt)}</lastBuildDate>` : ""}
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
