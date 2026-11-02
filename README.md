# awais/notes

Personal site of Awais Yusaf, co-founder & CTO at [Mantaq](https://www.mantaq.co). Static Next.js: a home page and a blog, in a plain monospace "notes" style with light and dark themes.

## Run it

Requires Node 20.9+.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit content

| What | Where |
|---|---|
| Name, email, booking link, domain, hero copy, Mantaq case study links, services, process, socials | `src/site.config.ts` |
| Blog posts | `content/blog/<slug>.mdx` |
| Images | `public/images/` |
| Colors and fonts | `src/app/globals.css` |

A new `.mdx` file in `content/blog/` becomes a page at `/blog/<slug>`. Frontmatter:

```yaml
title: "Post title"
summary: "One or two sentences for search engines and link previews."
publishedAt: "2026-11-02"
```

## Build and deploy

`next build` writes a fully static site to `out/`. Cloudflare serves it as static assets (`wrangler.jsonc`), and `public/_redirects` sends old portfolio URLs to the new pages.

```bash
npm run preview    # build, then serve out/ locally with wrangler
npm run deploy     # build, then deploy to Cloudflare
```

## Before launch

Set `domain` in `src/site.config.ts` to the real domain.
