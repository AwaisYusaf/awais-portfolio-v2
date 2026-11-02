import type { NextConfig } from "next";

// Fully static site: `next build` writes plain HTML to ./out, which
// Cloudflare serves as static assets (see wrangler.jsonc).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
