# [studio] website

Static Next.js site for the studio: a home page, case studies and a blog, in a plain monospace "notes" style with light and dark themes.

## Run it

Requires Node 20.9+.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit content

| What | Where |
|---|---|
| Name, email, booking link, domain, hero copy, services, process, socials | `src/site.config.ts` |
| Case studies | `content/work/<slug>.mdx` |
| Blog posts | `content/blog/<slug>.mdx` |
| Images | `public/images/` |
| Colors and fonts | `src/app/globals.css` |

A new `.mdx` file becomes a page at `/work/<slug>` or `/blog/<slug>`. Frontmatter:

```yaml
title: "Scan Vision"
tagline: "ai invoice data extraction"   # short line shown in lists
summary: "One or two sentences for search engines and link previews."
publishedAt: "2024-04-01"
stack: ["next.js", "fastapi"]           # case studies only
images:                                 # case studies only; first one is the link preview
  - "/images/work/scan-vision/01.jpg"
```

## Build and deploy

`next build` writes a fully static site to `out/`. Cloudflare serves it as static assets (`wrangler.jsonc`), and `public/_redirects` sends old portfolio URLs to the new pages.

```bash
npm run preview    # build, then serve out/ locally with wrangler
npm run deploy     # build, then deploy to Cloudflare
```

## Before launch

Replace the placeholders in `src/site.config.ts` (name, domain, email, booking link) and the worker `name` in `wrangler.jsonc`.
