import { site, siteUrl } from "@/site.config";

// The Person every page and post points to (by @id) in structured data.
export const personId = `${siteUrl}/#person`;

export const person = {
  "@type": "Person",
  "@id": personId,
  name: site.person.name,
  jobTitle: site.person.role,
  url: siteUrl,
  image: `${siteUrl}${site.person.avatar}`,
  worksFor: { "@type": "Organization", name: "Mantaq", url: site.mantaq.url },
  sameAs: site.socials.map((social) => social.href),
};

// Breadcrumb structured data: home, then the given pages in order.
export function breadcrumbs(...pages: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...pages].map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.name,
      item: `${siteUrl}${page.path}`,
    })),
  };
}
