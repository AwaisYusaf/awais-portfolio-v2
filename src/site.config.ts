// Everything on the site that isn't a blog post lives here.

export const site = {
  name: "awais/notes",
  // The primary host: Vercel redirects awaisyusaf.com to www.
  domain: "www.awaisyusaf.com",
  email: "awais@mantaq.co",
  phone: "+92 306 5396548", // whatsapp and calls
  bookingUrl: "https://www.mantaq.co/#contact",

  // How the site appears in Google and in link previews. The pages
  // themselves are lowercase; search results use normal capitalisation.
  seo: {
    // Shown as the site name above results, and after every page title:
    // "Blog | Awais Yusaf".
    siteName: "Awais Yusaf",
    // The home page's title in search results.
    title: "Awais Yusaf | Co-Founder & CTO at Mantaq",
    // The home page's description in search results (keep under 160 characters).
    description:
      "I'm Awais Yusaf, Co-Founder & CTO at Mantaq. I build document and workflow automation, AI features and web platforms for teams in the US, UK and EU.",
  },

  person: {
    name: "Awais Yusaf",
    role: "Co-Founder & CTO",
    avatar: "/images/avatar.jpeg",
  },

  // The green line above the hero. Set to null to hide it.
  availability: "mantaq is taking new projects" as string | null,

  hero: {
    line: "i build software for teams that run on paperwork.",
    sub: "i'm awais yusaf, co-founder & cto at mantaq, where i build document and workflow automation for teams in the us, uk and eu.",
  },

  // The /about page.
  about: {
    line: "i'm awais yusaf, co-founder & cto at mantaq.",
    paragraphs: [
      "mantaq is a small team in islamabad. we build document and workflow automation for teams in the us, uk and eu: forms come in, a person reviews them, documents go out, and every step is on record.",
      "i lead how we build it: the platform, the screens people use every day, and the ai that reads documents with a person in the loop. clients own the code.",
    ],
  },

  mantaq: {
    url: "https://www.mantaq.co",
    caseStudies: [
      {
        name: "peopleworks",
        detail: "hr letters, signing and reporting",
        href: "https://www.mantaq.co/case-studies/peopleworks",
      },
      {
        name: "va claims made easy",
        detail: "ai platform for va disability claims",
        href: "https://www.mantaq.co/case-studies/va-claims-made-easy",
      },
      {
        name: "compliance portal",
        detail: "credential, signature and audit tracking",
        href: "https://www.mantaq.co/case-studies/compliance-portal",
      },
      {
        name: "stay funded 360",
        detail: "receipt capture and grant reconciliation",
        href: "https://www.mantaq.co/case-studies/stay-funded-360",
      },
    ],
  },

  services: [
    { name: "document automation", detail: "intake, reading, review screens, documents out" },
    { name: "platforms", detail: "the app and backend it runs on, in your accounts" },
    { name: "interfaces", detail: "the screens your team uses every day" },
    { name: "ai features", detail: "extraction, chat, agents, with a person in the loop" },
  ],

  process: [
    "watch the work before building anything",
    "cut the steps that shouldn't exist",
    "build in pieces, with your real documents",
    "stay after launch",
  ],

  socials: [
    { label: "mantaq", href: "https://www.mantaq.co" },
    { label: "github", href: "https://github.com/AwaisYusaf" },
    { label: "linkedin", href: "https://www.linkedin.com/in/awaisyusaf" },
    { label: "x", href: "https://x.com/awaisyusaf" },
  ],

  gtmId: "GTM-NPP3249S",
  // Ownership checks for Google Search Console and Bing Webmaster Tools
  // (HTML meta tag method). Keep them, or the sites become unverified.
  googleSiteVerification: "HbmZfbFERqIKbNowdRS4nRGbEppZbcj_YgqEbtqKOMg",
  bingSiteVerification: "CD0C6A3BCD800198FD1491CD31D38CC7",
};

export const siteUrl = `https://${site.domain}`;
