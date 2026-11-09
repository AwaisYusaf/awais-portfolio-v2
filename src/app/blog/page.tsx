import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { formatDate, getPosts, type Post } from "@/lib/blog";
import { breadcrumbs, personId } from "@/lib/seo";
import { site, siteUrl } from "@/site.config";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes from ${site.person.name}, ${site.person.role} at Mantaq, on building software, AI and the systems behind them.`,
  alternates: { canonical: "/blog" },
};

function groupByYear(posts: Post[]) {
  const years = new Map<string, Post[]>();
  for (const post of posts) {
    const year = post.publishedAt.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), post]);
  }
  return [...years];
}

export default async function Blog() {
  const posts = await getPosts();
  const [latest, ...older] = posts;

  return (
    <div className="pb-16">
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "Blog",
              "@id": `${siteUrl}/blog#blog`,
              name: `Blog by ${site.person.name}`,
              url: `${siteUrl}/blog`,
              author: { "@id": personId },
              blogPost: posts
                .filter((post) => !post.draft)
                .map((post) => ({
                  "@type": "BlogPosting",
                  headline: post.title,
                  url: `${siteUrl}/blog/${post.slug}`,
                  datePublished: post.publishedAt,
                })),
            },
            breadcrumbs({ name: "Blog", path: "/blog" }),
          ],
        }}
      />
      <section className="flex flex-col gap-4 pt-18 pb-10">
        <p className="text-[13px] text-muted">blog ({posts.length})</p>
        <h1 className="text-[22px] leading-[1.4] font-medium tracking-[-0.02em]">
          notes on building software, ai and the systems behind them.
        </h1>
        <p className="text-muted">
          written by {site.person.name.toLowerCase()}, {site.person.role.toLowerCase()} at mantaq.
        </p>
        <a href="/rss.xml" className="self-start py-2.5 text-[13px] text-muted transition-colors hover:text-fg">
          rss ↗
        </a>
      </section>

      {!latest && <p className="text-muted">first post coming soon.</p>}

      {latest && (
        <Link
          href={`/blog/${latest.slug}`}
          className="group flex flex-col gap-2.5 rounded-2xl border border-line p-7 transition-colors hover:border-fg"
        >
          <span className="text-[13px] text-muted">
            {latest.draft ? "draft" : "latest"} ·{" "}
            <time dateTime={latest.publishedAt}>{formatDate(latest.publishedAt).toLowerCase()}</time> ·{" "}
            {latest.readingTime} min read
          </span>
          <span className="text-[20px] leading-[1.4] font-medium tracking-[-0.02em]">
            {latest.title}
          </span>
          {latest.summary && <span className="text-muted">{latest.summary}</span>}
          <span className="pt-1.5">
            read <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>
      )}

      {groupByYear(older).map(([year, posts]) => (
        <section key={year} className="pt-12">
          <p className="mb-1 text-[13px] text-muted">{year}</p>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-line py-4.5"
            >
              <time dateTime={post.publishedAt} className="shrink-0 basis-18 text-[13px] text-muted">
                {formatDate(post.publishedAt, { year: undefined }).toLowerCase()}
              </time>
              <span className="flex flex-[1_1_360px] flex-col gap-1">
                <span className="font-medium">
                  {post.draft && <span className="text-muted">[draft] </span>}
                  {post.title}
                </span>
                {post.summary && (
                  <span className="line-clamp-2 text-[14px] text-muted">{post.summary}</span>
                )}
              </span>
              <span className="text-[13px] text-muted transition-colors group-hover:text-fg">
                {post.readingTime} min
              </span>
            </Link>
          ))}
        </section>
      ))}
    </div>
  );
}
