import type { Metadata } from "next";
import Link from "next/link";

import { ContactDetails } from "@/components/ContactDetails";
import { JsonLd } from "@/components/JsonLd";
import { PillLink } from "@/components/PillLink";
import { Row } from "@/components/Row";
import { Section } from "@/components/Section";
import { formatDate, getPosts } from "@/lib/blog";
import { person } from "@/lib/seo";
import { site, siteUrl } from "@/site.config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const moreClass = "inline-block pt-4 text-[13px] text-muted transition-colors hover:text-fg";

export default async function Home() {
  const posts = (await getPosts()).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@graph": [
            {
              // Tells Google the site's name ("Awais Yusaf"), shown above results.
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              name: site.seo.siteName,
              alternateName: ["awaisyusaf.com", site.name],
              url: siteUrl,
              description: site.seo.description,
              inLanguage: "en",
              publisher: { "@id": person["@id"] },
            },
            { ...person, email: site.email, telephone: site.phone, description: site.seo.description },
          ],
        }}
      />

      <section className="flex flex-col gap-7 pt-24 pb-22">
        {site.availability && (
          <p className="flex items-center gap-2.5 text-[13px] text-muted">
            <span className="size-2 rounded-full bg-dot" aria-hidden="true" />
            {site.availability}
          </p>
        )}
        <h1 className="text-[28px] leading-[1.35] font-medium tracking-[-0.02em]">
          {site.hero.line}
        </h1>
        <p className="text-muted">{site.hero.sub}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <PillLink href={site.bookingUrl}>book a meeting →</PillLink>
          <PillLink href="/work" variant="outline">
            see work
          </PillLink>
        </div>
      </section>

      <Section id="work" label={`recent work (${site.mantaq.caseStudies.length})`}>
        {site.mantaq.caseStudies.map((study) => (
          <Row
            key={study.href}
            href={study.href}
            name={study.name}
            detail={study.detail}
            meta="mantaq.co"
          />
        ))}
        <Link href="/work" className={moreClass}>
          all work and what i build →
        </Link>
      </Section>

      {posts.length > 0 && (
        <Section label="latest writing">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-line py-4"
            >
              <time dateTime={post.publishedAt} className="shrink-0 basis-24 text-[13px] text-muted">
                {formatDate(post.publishedAt).toLowerCase()}
              </time>
              <span className="flex-[1_1_360px] font-medium">
                {post.draft && <span className="text-muted">[draft] </span>}
                {post.title}
              </span>
            </Link>
          ))}
          <Link href="/blog" className={moreClass}>
            all posts →
          </Link>
        </Section>
      )}

      <Section id="contact" label="contact" className="pt-14 pb-12">
        <p className="mb-4 text-[22px] font-medium tracking-[-0.02em]">
          {"got a process that eats your team's week? let's talk."}
        </p>
        <ContactDetails />
      </Section>
    </>
  );
}
