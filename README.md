# awais/notes

Personal site of Awais Yusaf, co-founder & CTO at [Mantaq](https://www.mantaq.co). Static Next.js: a home page and a blog written in Contentful, in a plain monospace "notes" style with light and dark themes.

## Run it

Requires Node 26 (older versions work locally with a warning).

```bash
npm install
cp .env.example .env.local   # then fill in the Contentful keys (see Blog)
npm run dev                  # http://localhost:3000
```

## Edit content

| What | Where |
|---|---|
| Name, email, booking link, domain, hero copy, Mantaq case study links, services, process, socials | `src/site.config.ts` |
| Blog posts | Contentful (see below) |
| Images for the site | `public/images/` |
| Colors and fonts | `src/app/globals.css` |

## Blog

Posts are written in [Contentful](https://app.contentful.com). Every post becomes a static HTML page at build time, so Google gets the full post, with no JavaScript needed and no request to Contentful when someone reads it. Publishing a post in Contentful triggers a Vercel rebuild, and the post is live about a minute later.

### One-time setup

1. Create a Contentful space (the free plan is enough).
2. In Contentful, go to **Settings → API keys → Add API key**. Copy the Space ID, the Content Delivery API token and the Content Preview API token.
3. In **Settings → CMA tokens**, create a personal access token. It's only used for the next step and stays on your computer.
4. Copy `.env.example` to `.env.local`, fill it in, then run:

   ```bash
   npm run contentful:setup
   ```

   This creates two content types, **Blog post** and **Code block**. It's safe to run again.
5. In Vercel, go to **Project → Settings → Environment Variables** and add `CONTENTFUL_SPACE_ID` and `CONTENTFUL_DELIVERY_API_ACCESS_TOKEN` for Production and Preview. Don't add the preview or management tokens there.
6. Rebuild on publish:
   1. In Vercel, go to **Settings → Git → Deploy Hooks** and create a hook for `main`.
   2. Put its URL in `.env.local` as `VERCEL_DEPLOY_HOOK_URL` and run `npm run contentful:setup` again. That adds the Contentful webhook.

   You can also add the webhook by hand: **Contentful → Settings → Webhooks**, using the Vercel template.

### Write a post

1. In Contentful, open **Content → Add entry → Blog post**.
2. Fill in **Title** (the slug fills itself in from it), **Summary** and **Body**.
3. Optional fields:
   - **Cover image**
   - **Tags**
   - **Published on**: if empty, the post uses the day you first publish it.
   - **Updated on**: adds "updated" to the byline.
   - **SEO title** and **SEO description**: replace the title and summary in Google results.
4. What the body can contain:
   - Headings, lists, quotes (shown as a centred pull quote), tables, and links, including links to other posts.
   - Images: use **+ Embed → Asset**. The image's description is used as its alt text and caption.
   - Code: use **+ Embed → Entry → Code block**, choose the language, and optionally add a file name to show above it. Short snippets can also be marked as code, with shift+enter between the lines.
5. To see a draft before publishing, run `npm run dev` (with the preview token in `.env.local`) and open `/blog/<slug>`. Drafts are labelled and never reach the live site.
6. **Publish** to put the post live. **Unpublish** takes it down on the next rebuild.

### SEO

Each post page has:

- Title and description, taken from the SEO fields if you filled them in.
- A canonical URL.
- Open Graph and X cards, with a generated preview image.
- `BlogPosting` and breadcrumb structured data, plus `<time>` dates.
- Responsive WebP images from Contentful's image CDN.

Posts are also listed in `sitemap.xml` (with last-modified dates) and `rss.xml`. Unknown slugs return the 404 page.

## Build and deploy

`next build` writes a fully static site to `out/` (Node 26). It reads posts from Contentful, so it needs `CONTENTFUL_SPACE_ID` and `CONTENTFUL_DELIVERY_API_ACCESS_TOKEN`. Without them it stops with an error, and on Vercel the previous deployment stays live.

The live site is on Vercel at [www.awaisyusaf.com](https://www.awaisyusaf.com): every push to `main` deploys. Redirects for old portfolio URLs are in `vercel.json`.

The same build can also run on Cloudflare (`wrangler.jsonc`, with redirects in `public/_redirects`):

```bash
npm run preview    # build, then serve out/ locally with wrangler
npm run deploy     # build, then deploy to Cloudflare
```
