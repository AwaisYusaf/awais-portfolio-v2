// Creates or updates the blog's content model in Contentful: a "Blog post"
// type and a "Code block" type for code inside posts. Safe to run again.
//
//   npm run contentful:setup
//
// Needs CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN (in .env.local).
// If VERCEL_DEPLOY_HOOK_URL is set too, it also adds the webhook that
// rebuilds the site whenever something is published or unpublished.

const space = process.env.CONTENTFUL_SPACE_ID;
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT || "master";
const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;
const host = process.env.CONTENTFUL_MANAGEMENT_HOST || "api.contentful.com";

if (!space || !token) {
  console.error("Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env.local first.");
  process.exit(1);
}

const spaceUrl = `https://${host}/spaces/${space}`;
const envUrl = `${spaceUrl}/environments/${environment}`;

async function api(method, url, { body, version } = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/vnd.contentful.management.v1+json",
        ...(version !== undefined && { "X-Contentful-Version": String(version) }),
      },
      body: body && JSON.stringify(body),
    });
    if (res.status === 429 && attempt < 5) {
      const wait = Number(res.headers.get("X-Contentful-RateLimit-Reset") || 1);
      await new Promise((resolve) => setTimeout(resolve, wait * 1000));
      continue;
    }
    if (res.status === 404 && method === "GET") return null;
    const json = res.status === 204 ? null : await res.json();
    if (!res.ok) {
      const details = json?.details ? ` ${JSON.stringify(json.details)}` : "";
      throw new Error(`${method} ${url.replace(spaceUrl, "")}: ${res.status} ${json?.message ?? ""}${details}`);
    }
    return json;
  }
}

const languages = [
  "plaintext", "typescript", "tsx", "javascript", "jsx", "json", "bash", "python", "sql",
  "yaml", "html", "css", "go", "rust", "java", "kotlin", "swift", "php", "ruby", "csharp",
  "graphql", "dockerfile", "toml", "xml", "markdown", "diff",
];

const field = (id, name, type, extra = {}) => ({
  id, name, type, localized: false, required: false, validations: [], disabled: false, omitted: false, ...extra,
});

const contentTypes = [
  {
    id: "codeBlock",
    name: "Code block",
    description: "Code inside a blog post: embed it in the body with + Embed → Entry.",
    displayField: "filename",
    fields: [
      field("filename", "File name", "Symbol"),
      field("language", "Language", "Symbol", { required: true, validations: [{ in: languages }] }),
      field("code", "Code", "Text", { required: true }),
    ],
    controls: [
      { fieldId: "filename", widgetId: "singleLine", settings: { helpText: "Optional, shown above the code, e.g. src/lib/retry.ts" } },
      { fieldId: "language", widgetId: "dropdown", settings: { helpText: "Used for syntax highlighting." } },
      { fieldId: "code", widgetId: "multipleLine" },
    ],
  },
  {
    id: "blogPost",
    name: "Blog post",
    description: "A post on www.awaisyusaf.com/blog. Publishing it rebuilds the site.",
    displayField: "title",
    fields: [
      field("title", "Title", "Symbol", { required: true }),
      field("slug", "Slug", "Symbol", {
        required: true,
        validations: [
          { unique: true },
          {
            regexp: { pattern: "^[a-z0-9]+(-[a-z0-9]+)*$" },
            message: "Lowercase letters, numbers and dashes only, e.g. retry-storms",
          },
        ],
      }),
      field("summary", "Summary", "Text", { required: true, validations: [{ size: { max: 300 } }] }),
      field("body", "Body", "RichText", {
        required: true,
        validations: [
          {
            enabledNodeTypes: [
              "heading-2", "heading-3", "heading-4", "ordered-list", "unordered-list", "hr",
              "blockquote", "table", "embedded-entry-block", "embedded-asset-block",
              "hyperlink", "entry-hyperlink", "asset-hyperlink",
            ],
            message: "Headings 2 to 4, lists, quotes, tables, links, images and code blocks.",
          },
          { enabledMarks: ["bold", "italic", "underline", "code", "strikethrough"] },
          {
            nodes: {
              "embedded-entry-block": [{ linkContentType: ["codeBlock"], message: "Only code blocks can be embedded." }],
              "entry-hyperlink": [{ linkContentType: ["blogPost"], message: "Links can only point to other blog posts." }],
            },
          },
        ],
      }),
      field("cover", "Cover image", "Link", { linkType: "Asset", validations: [{ linkMimetypeGroup: ["image"] }] }),
      field("tags", "Tags", "Array", { items: { type: "Symbol", validations: [] } }),
      field("publishedAt", "Published on", "Date"),
      field("updatedAt", "Updated on", "Date"),
      field("seoTitle", "SEO title", "Symbol", { validations: [{ size: { max: 70 } }] }),
      field("seoDescription", "SEO description", "Text", { validations: [{ size: { max: 170 } }] }),
    ],
    controls: [
      { fieldId: "title", widgetId: "singleLine", settings: { helpText: "Shown as you write it, e.g. Retry storms: what GitHub's outage teaches" } },
      { fieldId: "slug", widgetId: "slugEditor", settings: { helpText: "The address: /blog/<slug>. Filled in from the title; don't change it after publishing." } },
      { fieldId: "summary", widgetId: "multipleLine", settings: { helpText: "One or two sentences. Shown under the title, in the blog list, in Google results and in link previews." } },
      { fieldId: "body", widgetId: "richTextEditor" },
      { fieldId: "cover", widgetId: "assetLinkEditor", settings: { helpText: "Optional wide image under the title. The image's description is its alt text and caption." } },
      { fieldId: "tags", widgetId: "tagEditor", settings: { helpText: "Optional, shown above the title, e.g. engineering, ai." } },
      { fieldId: "publishedAt", widgetId: "datePicker", settings: { format: "dateonly", helpText: "Leave empty to use the day you first publish." } },
      { fieldId: "updatedAt", widgetId: "datePicker", settings: { format: "dateonly", helpText: "Set it after a real update: the post then shows \"updated\" with this date." } },
      { fieldId: "seoTitle", widgetId: "singleLine", settings: { helpText: "Optional. Replaces the title in Google results and browser tabs. Best under 60 characters." } },
      { fieldId: "seoDescription", widgetId: "multipleLine", settings: { helpText: "Optional. Replaces the summary in Google results. Best under 160 characters." } },
    ],
  },
];

async function upsertContentType({ id, controls, ...definition }) {
  const existing = await api("GET", `${envUrl}/content_types/${id}`);
  // Fields that exist in Contentful but not here are kept, never deleted.
  const extra = (existing?.fields ?? []).filter((f) => !definition.fields.some((d) => d.id === f.id));
  const saved = await api("PUT", `${envUrl}/content_types/${id}`, {
    body: { ...definition, fields: [...definition.fields, ...extra] },
    version: existing?.sys.version,
  });
  await api("PUT", `${envUrl}/content_types/${id}/published`, { version: saved.sys.version });

  const editor = await api("GET", `${envUrl}/content_types/${id}/editor_interface`);
  const others = (editor?.controls ?? []).filter((c) => !controls.some((d) => d.fieldId === c.fieldId));
  await api("PUT", `${envUrl}/content_types/${id}/editor_interface`, {
    body: { controls: [...controls.map((c) => ({ widgetNamespace: "builtin", ...c })), ...others] },
    version: editor.sys.version,
  });
  console.log(`${existing ? "updated" : "created"} content type: ${definition.name}`);
}

async function upsertWebhook() {
  const name = "Rebuild www.awaisyusaf.com (Vercel)";
  const { items } = await api("GET", `${spaceUrl}/webhook_definitions?limit=100`);
  const existing = items.find((hook) => hook.name === name);
  const body = {
    name,
    url: deployHook,
    topics: [
      "Entry.publish", "Entry.unpublish", "Entry.delete",
      "Asset.publish", "Asset.unpublish", "Asset.delete",
    ],
    filters: [{ equals: [{ doc: "sys.environment.sys.id" }, environment] }],
    headers: [],
  };
  if (existing) {
    await api("PUT", `${spaceUrl}/webhook_definitions/${existing.sys.id}`, { body, version: existing.sys.version });
  } else {
    await api("POST", `${spaceUrl}/webhook_definitions`, { body });
  }
  console.log(`${existing ? "updated" : "created"} webhook: ${name}`);
}

for (const contentType of contentTypes) await upsertContentType(contentType);
if (deployHook) await upsertWebhook();
console.log(
  deployHook
    ? "Done."
    : "Done. To rebuild the site on publish, add VERCEL_DEPLOY_HOOK_URL and run this again (or add the webhook in Contentful: see README).",
);
