import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Collection = "blog";

export type Metadata = {
  title: string;
  summary: string;
  publishedAt: string;
};

export type Entry = {
  slug: string;
  metadata: Metadata;
  content: string;
};

const contentDir = path.join(process.cwd(), "content");

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    summary: data.summary || "",
    publishedAt: data.publishedAt,
  };

  return { metadata, content };
}

function getMDXData(dir: string): Entry[] {
  return getMDXFiles(dir).map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content };
  });
}

// Newest first.
export function getEntries(collection: Collection): Entry[] {
  return getMDXData(path.join(contentDir, collection)).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );
}

export function getEntry(collection: Collection, slug: string) {
  return getEntries(collection).find((entry) => entry.slug === slug);
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
