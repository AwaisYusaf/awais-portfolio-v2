// A small Contentful client, used at build time (plain fetch, no SDK).
//
// `next build` reads published entries from the Content Delivery API, so
// the static site only ever contains published posts. `npm run dev` also
// reads drafts from the Content Preview API when a preview token is set.

export type RawEntry = {
  sys: {
    id: string;
    type: "Entry";
    // On the Delivery API createdAt is the first publish, updatedAt the latest.
    createdAt: string;
    updatedAt: string;
    contentType: { sys: { id: string } };
  };
  fields: Record<string, unknown>;
};

export type RawAsset = {
  sys: { id: string; type: "Asset" };
  fields: {
    title?: string;
    description?: string;
    file?: {
      url: string;
      contentType: string;
      details?: { image?: { width: number; height: number } };
    };
  };
};

type Collection = {
  items: RawEntry[];
  includes?: { Entry?: RawEntry[]; Asset?: RawAsset[] };
  total: number;
};

type Api = "delivery" | "preview";

const env = process.env;

export const previewEnabled =
  env.NODE_ENV !== "production" && Boolean(env.CONTENTFUL_PREVIEW_API_ACCESS_TOKEN);

function endpoint(api: Api) {
  const space = env.CONTENTFUL_SPACE_ID;
  const token =
    api === "preview" ? env.CONTENTFUL_PREVIEW_API_ACCESS_TOKEN : env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN;
  if (!space || !token) {
    throw new Error(
      "Contentful is not set up: add CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_API_ACCESS_TOKEN to .env.local (locally) or to the Vercel project's environment variables. See README → Blog.",
    );
  }
  // Hosts can be changed for Contentful's EU data residency
  // (cdn.eu.contentful.com, preview.eu.contentful.com).
  const host =
    api === "preview"
      ? env.CONTENTFUL_PREVIEW_HOST || "preview.contentful.com"
      : env.CONTENTFUL_HOST || "cdn.contentful.com";
  const origin = host.includes("://") ? host : `https://${host}`;
  const environment = env.CONTENTFUL_ENVIRONMENT || "master";
  return { url: `${origin}/spaces/${space}/environments/${environment}/entries`, token };
}

async function request(api: Api, query: Record<string, string>): Promise<Collection> {
  const { url, token } = endpoint(api);
  const target = `${url}?${new URLSearchParams(query)}`;

  for (let attempt = 1; ; attempt++) {
    const res = await fetch(target, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) return res.json();

    // Rate limits and server errors are usually gone a moment later.
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      continue;
    }

    const body = await res.json().catch(() => ({}));
    const hint =
      res.status === 401
        ? " Check the access token."
        : res.status === 404
          ? " Check CONTENTFUL_SPACE_ID."
          : body?.details?.errors?.some((e: { name?: string }) => e.name === "unknownContentType")
            ? " The content model is missing: run `npm run contentful:setup`."
            : "";
    const message = String(body?.message ?? res.statusText).replace(/\.$/, "");
    throw new Error(`Contentful ${api} API: ${res.status} ${message}.${hint}`);
  }
}

// Every entry of a content type, with linked entries and assets (cover
// images, code blocks, embedded images, linked posts) by id.
export async function fetchEntries(contentType: string, api: Api = "delivery") {
  const items: RawEntry[] = [];
  const entries = new Map<string, RawEntry>();
  const assets = new Map<string, RawAsset>();
  const limit = 100;

  for (let skip = 0; ; skip += limit) {
    const page = await request(api, {
      content_type: contentType,
      include: "2",
      limit: String(limit),
      skip: String(skip),
    });
    items.push(...page.items);
    for (const entry of [...page.items, ...(page.includes?.Entry ?? [])]) {
      entries.set(entry.sys.id, entry);
    }
    for (const asset of page.includes?.Asset ?? []) assets.set(asset.sys.id, asset);
    if (skip + limit >= page.total) break;
  }

  return { items, entries, assets };
}

// Just the ids of published entries, to tell drafts apart in preview.
export async function fetchPublishedIds(contentType: string) {
  const ids = new Set<string>();
  const limit = 1000;
  for (let skip = 0; ; skip += limit) {
    const page = await request("delivery", {
      content_type: contentType,
      select: "sys.id",
      limit: String(limit),
      skip: String(skip),
    });
    for (const entry of page.items) ids.add(entry.sys.id);
    if (skip + limit >= page.total) break;
  }
  return ids;
}
