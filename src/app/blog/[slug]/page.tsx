import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article } from "@/components/Article";
import { JsonLd } from "@/components/JsonLd";
import { formatDate, getEntries, getEntry } from "@/lib/content";
import { site, siteUrl } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getEntries("blog").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getEntry("blog", slug);
  if (!post) return {};

  const { title, summary, publishedAt } = post.metadata;
  return {
    title: title.toLowerCase(),
    description: summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description: summary,
      type: "article",
      publishedTime: publishedAt,
      url: `/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getEntry("blog", slug);
  if (!post) notFound();

  const { metadata, content } = post;

  return (
    <>
      <JsonLd
        data={{
          "@type": "BlogPosting",
          headline: metadata.title,
          description: metadata.summary,
          datePublished: metadata.publishedAt,
          url: `${siteUrl}/blog/${slug}`,
          author: { "@type": "Person", name: site.founder.name },
          publisher: { "@type": "Organization", name: site.name, url: siteUrl },
        }}
      />
      <Article
        back={{ href: "/blog", label: "blog" }}
        title={metadata.title}
        meta={formatDate(metadata.publishedAt)}
        source={content}
      />
    </>
  );
}
