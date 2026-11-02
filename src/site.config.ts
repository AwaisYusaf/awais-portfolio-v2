// Everything on the site that isn't a case study or blog post lives here.
// Placeholders to replace before launch: name, domain, email, bookingUrl.

export const site = {
  name: "[studio]",
  domain: "yourdomain.com",
  email: "hello@yourdomain.com",
  bookingUrl: "https://cal.com/your-link",
  description:
    "a small dev studio building web apps, ai tools and the backends behind them.",
  founder: {
    name: "Awais Yusaf",
    avatar: "/images/avatar.jpeg",
  },

  // Shows the green "open for new projects" line on the home page.
  available: true,

  hero: {
    line: "we build web apps, ai tools and the backend that keeps them running.",
    sub: "a small dev studio run by awais yusaf. no account managers, you talk to the people writing the code.",
  },

  industries: "worked across healthcare, legal, e-commerce, telecom and events.",

  services: [
    { name: "web apps", detail: "saas, dashboards, internal tools" },
    { name: "ai features", detail: "document extraction, chat, agents" },
    { name: "automation", detail: "scrapers, data pipelines, ocr" },
    { name: "cloud", detail: "aws, docker, deploys that don't break" },
  ],

  process: [
    "quick call, tell us what you're building",
    "scope + quote",
    "weekly builds you can click through",
    "launch, then we stick around",
  ],

  socials: [
    { label: "github", href: "https://github.com/AwaisYusaf" },
    { label: "linkedin", href: "https://www.linkedin.com/in/awaisyusaf" },
    { label: "x", href: "https://x.com/awaisyusaf" },
  ],

  gtmId: "GTM-NPP3249S",
};

export const siteUrl = `https://${site.domain}`;
