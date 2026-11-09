import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { PillLink } from "@/components/PillLink";
import { Row } from "@/components/Row";
import { Section } from "@/components/Section";
import { breadcrumbs, personId } from "@/lib/seo";
import { site, siteUrl } from "@/site.config";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects Awais Yusaf has built at Mantaq: document and workflow automation for HR, VA disability claims, compliance and grant reconciliation.",
  alternates: { canonical: "/work" },
};

export default function Work() {
  return (
    <div className="pb-16">
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${siteUrl}/work#page`,
              name: "Work",
              url: `${siteUrl}/work`,
              about: { "@id": personId },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: site.mantaq.caseStudies.map((study, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: study.name,
                  url: study.href,
                })),
              },
            },
            breadcrumbs({ name: "Work", path: "/work" }),
          ],
        }}
      />

      <PageHeader label="work" title="software i've built at mantaq.">
        <p className="text-muted">
          selected client projects. each one links to its full case study on mantaq.co.
        </p>
      </PageHeader>

      <Section label={`recent work (${site.mantaq.caseStudies.length})`}>
        {site.mantaq.caseStudies.map((study) => (
          <Row
            key={study.href}
            href={study.href}
            name={study.name}
            detail={study.detail}
            meta="mantaq.co"
          />
        ))}
      </Section>

      <Section label="what i build at mantaq">
        <ul className="flex flex-col gap-2.5">
          {site.services.map((service) => (
            <li key={service.name} className="flex flex-wrap gap-x-4">
              <span className="shrink-0 basis-52">{service.name}</span>
              <span className="flex-[1_1_240px] text-muted">{service.detail}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="have something similar in mind?">
        <div className="flex flex-wrap gap-3">
          <PillLink href={site.bookingUrl}>book a meeting →</PillLink>
          <PillLink href={site.mantaq.url} variant="outline">
            mantaq.co ↗
          </PillLink>
        </div>
      </Section>
    </div>
  );
}
