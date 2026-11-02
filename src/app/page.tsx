import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PillLink } from "@/components/PillLink";
import { Row } from "@/components/Row";
import { Section } from "@/components/Section";
import { site, siteUrl } from "@/site.config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "Person",
          name: site.person.name,
          jobTitle: site.person.role,
          url: siteUrl,
          email: site.email,
          image: `${siteUrl}${site.person.avatar}`,
          worksFor: { "@type": "Organization", name: "Mantaq", url: site.mantaq.url },
          sameAs: site.socials.map((social) => social.href),
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
          <PillLink href={site.bookingUrl}>book a call →</PillLink>
          <PillLink href="#work" variant="outline">
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
      </Section>

      <Section id="services" label="what i build at mantaq">
        <ul className="flex flex-col gap-2.5">
          {site.services.map((service) => (
            <li key={service.name} className="flex flex-wrap gap-x-4">
              <span className="shrink-0 basis-52">{service.name}</span>
              <span className="flex-[1_1_240px] text-muted">{service.detail}</span>
            </li>
          ))}
        </ul>
      </Section>

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

      <Section id="contact" label="contact" className="pt-14 pb-12">
        <p className="mb-4 text-[22px] font-medium tracking-[-0.02em]">
          {"got a process that eats your team's week? let's talk."}
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={`mailto:${site.email}`}
            className="underline decoration-line underline-offset-4 transition-colors hover:decoration-fg"
          >
            {site.email}
          </a>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-fg"
          >
            or book a call →
          </a>
        </p>
      </Section>
    </>
  );
}
