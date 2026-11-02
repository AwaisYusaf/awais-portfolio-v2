import type { Metadata } from "next";

import { Label } from "@/components/Section";
import { Row } from "@/components/Row";
import { formatDate, getEntries } from "@/lib/content";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "blog",
  description: `notes from ${site.name} on building software, ai and the web.`,
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  const posts = getEntries("blog");

  return (
    <section className="pt-24 pb-16">
      <Label>blog ({posts.length})</Label>
      <p className="mb-8 text-muted">notes on building software, ai and the web.</p>
      <div className="border-t border-line">
        {posts.map((post) => (
          <Row
            key={post.slug}
            href={`/blog/${post.slug}`}
            name={post.metadata.title}
            meta={formatDate(post.metadata.publishedAt)}
          />
        ))}
      </div>
    </section>
  );
}
