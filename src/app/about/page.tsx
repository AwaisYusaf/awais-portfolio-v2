import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { breadcrumbs, person } from "@/lib/seo";
import { site, siteUrl } from "@/site.config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Awais Yusaf is Co-Founder & CTO of Mantaq, a team in Islamabad building document and workflow automation for companies in the US, UK and EU.",
  alternates: { canonical: "/about" },
  // A page's openGraph replaces the layout's, so the site name is repeated.
  openGraph: { type: "profile", siteName: site.seo.siteName, locale: "en_US" },
};

const linkClass =
  "underline decoration-line underline-offset-4 transition-colors hover:decoration-fg";

export default function About() {
  return (
    <div className="pb-16">
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "ProfilePage",
              "@id": `${siteUrl}/about#page`,
              name: "About",
              url: `${siteUrl}/about`,
              mainEntity: { ...person, email: site.email },
            },
            breadcrumbs({ name: "About", path: "/about" }),
          ],
        }}
      />

      <PageHeader
        label="about"
        title={site.about.line}
        media={
          <Image
            src={site.person.avatar}
            alt={site.person.name}
            width={72}
            height={72}
            className="mb-2 size-18 rounded-full object-cover"
            priority
          />
        }
      >
        {site.about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-muted">
            {paragraph}
          </p>
        ))}
      </PageHeader>

      <Section label="how i work">
        <ol className="flex flex-col gap-2.5">
          {site.process.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="text-muted">{String(index + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="more">
        <ul className="flex flex-col gap-2.5">
          <li>
            <Link href="/work" className={linkClass}>
              work
            </Link>
            <span className="text-muted">{" · what i've built at mantaq"}</span>
          </li>
          <li>
            <Link href="/blog" className={linkClass}>
              blog
            </Link>
            <span className="text-muted"> · notes on building software and ai</span>
          </li>
          <li>
            <Link href="/contact" className={linkClass}>
              contact
            </Link>
            <span className="text-muted"> · email, whatsapp or a meeting</span>
          </li>
        </ul>
      </Section>

      <Section label="elsewhere">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noopener noreferrer me" className={linkClass}>
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
