import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { site } from "@/site.config";

// Generated once at build time; case study pages use their own cover instead.
export const dynamic = "force-static";
export const alt = site.seo.description;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
        <div style={{ fontSize: 32, color: "#8e8e8e" }}>{site.name}</div>
        <div style={{ fontSize: 64, lineHeight: 1.15, letterSpacing: "-0.03em", maxWidth: 980 }}>
          {site.hero.line}
        </div>
        <div style={{ fontSize: 28, color: "#8e8e8e" }}>
          {`${site.person.name.toLowerCase()} · ${site.person.role.toLowerCase()} at mantaq`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, style: "normal" }],
    },
  );
}
