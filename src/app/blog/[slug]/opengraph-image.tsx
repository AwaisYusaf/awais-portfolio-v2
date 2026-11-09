import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { formatDate, getPost, getPostParams } from "@/lib/blog";
import { site } from "@/site.config";

// One link-preview image per post, generated at build time.
export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getPostParams();
}

export default async function PostImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const font = await readFile(path.join(process.cwd(), "src/assets/Inter.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          background: "#0b0b0b",
          color: "#ededed",
          fontFamily: "Inter",
        }}
      >
        <div style={{ fontSize: 30, color: "#8e8e8e" }}>{`${site.name} / blog`}</div>
        <div style={{ fontSize: 60, lineHeight: 1.12, letterSpacing: "-0.03em", maxWidth: 1000 }}>
          {post?.title ?? site.name}
        </div>
        <div style={{ fontSize: 26, color: "#8e8e8e" }}>
          {post
            ? `${site.person.name.toLowerCase()} · ${formatDate(post.publishedAt).toLowerCase()} · ${post.readingTime} min read`
            : site.person.name.toLowerCase()}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, style: "normal" }],
    },
  );
}
