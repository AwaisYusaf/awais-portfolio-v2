import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article } from "@/components/Article";
import { JsonLd } from "@/components/JsonLd";
import { getPost, getPostParams, getPosts } from "@/lib/blog";
import { breadcrumbs, person } from "@/lib/seo";
import { site, siteUrl } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

// One static HTML page per post, written at build time. Slugs that weren't
// built are a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getPostParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { robots: { index: false } };

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.summary;
  const url = `/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: site.person.name, url: siteUrl }],
    alternates: { canonical: url },
    // Drafts only exist in `npm run dev`, but never let one be indexed.
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [siteUrl],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const posts = await getPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) notFound();

  const post = posts[index];
  // The next older post, wrapping round to the newest.
  const next = posts.length > 1 ? posts[(index + 1) % posts.length] : undefined;
  const url = `${siteUrl}/blog/${post.slug}`;
  const author = person;

  return (
    <>
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#post`,
              headline: post.title,
              description: post.seoDescription ?? post.summary,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt ?? post.publishedAt,
              url,
              mainEntityOfPage: url,
              image: [
                `${url}/opengraph-image`,
                ...(post.cover ? [`${post.cover.url}?w=1200&fm=jpg&q=80`] : []),
              ],
              keywords: post.tags.join(", "),
              wordCount: post.wordCount,
              inLanguage: "en",
              author,
              publisher: author,
              isPartOf: { "@type": "Blog", "@id": `${siteUrl}/blog#blog`, url: `${siteUrl}/blog` },
            },
            breadcrumbs(
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ),
          ],
        }}
      />
      <Article post={post} next={next} />
    </>
  );
}
