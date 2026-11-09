import type { Metadata } from "next";

import { ContactDetails } from "@/components/ContactDetails";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { breadcrumbs, personId } from "@/lib/seo";
import { site, siteUrl } from "@/site.config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Awais Yusaf by email (${site.email}), WhatsApp or call, or book a meeting about document and workflow automation with Mantaq.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="pb-16">
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": `${siteUrl}/contact#page`,
              name: "Contact",
              url: `${siteUrl}/contact`,
              about: { "@id": personId },
            },
            breadcrumbs({ name: "Contact", path: "/contact" }),
          ],
        }}
      />

      <PageHeader label="contact" title="got a process that eats your team's week? let's talk.">
        <p className="text-muted">
          email or message me about a project, or book a meeting with mantaq.
        </p>
      </PageHeader>

      <section className="border-t border-line pt-10">
        <ContactDetails />
      </section>
    </div>
  );
}
