import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article } from "@/components/Article";
import { JsonLd } from "@/components/JsonLd";
import { Row } from "@/components/Row";
import { Section } from "@/components/Section";
import { formatYear, getEntries, getEntry } from "@/lib/content";
import { site, siteUrl } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getEntries("work").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("work", slug);
  if (!entry) return {};

  const { title, summary, images } = entry.metadata;
  return {
    title: title.toLowerCase(),
    description: summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title,
      description: summary,
      type: "article",
      url: `/work/${slug}`,
      images: images.slice(0, 1),
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = getEntries("work");
  const index = work.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();

  const { metadata, content } = work[index];
  const next = work.length > 1 ? work[(index + 1) % work.length] : undefined;
  const year = formatYear(metadata.publishedAt);

  return (
    <>
      <JsonLd
        data={{
          "@type": "CreativeWork",
          name: metadata.title,
          description: metadata.summary,
          dateCreated: metadata.publishedAt,
          url: `${siteUrl}/work/${slug}`,
          image: metadata.images.map((src) => `${siteUrl}${src}`),
          creator: { "@type": "Organization", name: site.name, url: siteUrl },
        }}
      />
      <Article
        back={{ href: "/#work", label: "work" }}
        title={metadata.title}
        tagline={metadata.tagline}
        meta={[year, metadata.stack.join(", ")].filter(Boolean).join(" · ")}
        images={metadata.images}
        source={content}
      >
        {next && (
          <Section label="next project" className="mt-16 pt-10">
            <Row
              href={`/work/${next.slug}`}
              name={next.metadata.title}
              detail={next.metadata.tagline}
              meta={formatYear(next.metadata.publishedAt)}
            />
          </Section>
        )}
      </Article>
    </>
  );
}
